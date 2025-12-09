"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

interface LocationPoint {
  lat: number
  lng: number
  address?: string
}

interface MapBookingProps {
  language?: Language
  // optional external selections: when parent/client sets these, map will show them
  initialPickup?: LocationPoint | null
  initialDelivery?: LocationPoint | null
  onLocationsChange?: (pickup: LocationPoint | null, delivery: LocationPoint | null) => void
}

export function MapBooking({
  language = "de",
  initialPickup = null,
  initialDelivery = null,
  onLocationsChange,
}: MapBookingProps) {
  const t = translations[language]
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const [pickupLocation, setPickupLocation] = useState<LocationPoint | null>(null)
  const [deliveryLocation, setDeliveryLocation] = useState<LocationPoint | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [activeMode, setActiveMode] = useState<"pickup" | "delivery" | null>(null)
  const pickupMarker = useRef<any>(null)
  const deliveryMarker = useRef<any>(null)
  const routeLine = useRef<any>(null)

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [lockMarkers, setLockMarkers] = useState(false)
  const [showCoordsOnMarker, setShowCoordsOnMarker] = useState(true)

  const [manualPickupLat, setManualPickupLat] = useState<string>("")
  const [manualPickupLng, setManualPickupLng] = useState<string>("")
  const [manualDeliveryLat, setManualDeliveryLat] = useState<string>("")
  const [manualDeliveryLng, setManualDeliveryLng] = useState<string>("")

  // Helper to create/update markers programmatically
  async function setMarker(type: "pickup" | "delivery", lat: number, lng: number, address?: string) {
    const leaflet = await import("leaflet")
    if (!mapRef.current) return

    const iconUrl =
      type === "pickup"
        ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
        : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"

    const marker = leaflet.marker([lat, lng], {
      icon: leaflet.icon({
        iconUrl,
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    }).addTo(mapRef.current)

    const popupText = address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    marker.bindPopup(popupText)

    if (type === "pickup") {
      if (pickupMarker.current) try { mapRef.current.removeLayer(pickupMarker.current) } catch {}
      pickupMarker.current = marker
      setPickupLocation({ lat, lng, address })
      setManualPickupLat(lat.toString())
      setManualPickupLng(lng.toString())
    } else {
      if (deliveryMarker.current) try { mapRef.current.removeLayer(deliveryMarker.current) } catch {}
      deliveryMarker.current = marker
      setDeliveryLocation({ lat, lng, address })
      setManualDeliveryLat(lat.toString())
      setManualDeliveryLng(lng.toString())
    }
  }

  function clearPoints() {
    if (pickupMarker.current && mapRef.current) try { mapRef.current.removeLayer(pickupMarker.current) } catch {}
    if (deliveryMarker.current && mapRef.current) try { mapRef.current.removeLayer(deliveryMarker.current) } catch {}
    if (routeLine.current && mapRef.current) try { mapRef.current.removeLayer(routeLine.current) } catch {}
    pickupMarker.current = null
    deliveryMarker.current = null
    routeLine.current = null
    setPickupLocation(null)
    setDeliveryLocation(null)
    setDistance(null)
    setEstimatedPrice(null)
    setManualPickupLat("")
    setManualPickupLng("")
    setManualDeliveryLat("")
    setManualDeliveryLng("")
  }

  // Initialize map and click handler
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
    let mounted = true

    ;(async () => {
      const leaflet = await import("leaflet")
      const map = leaflet.map(mapContainer.current!).setView([51.1657, 10.4515], 6)

      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      // Click handler: create/update pickup/delivery depending on state
      map.on("click", (e: any) => {
        if (lockMarkers) return

        const { lat, lng } = e.latlng
        const location: LocationPoint = { lat, lng }

        const target: "pickup" | "delivery" = activeMode
          ? activeMode
          : pickupLocation == null
          ? "pickup"
          : deliveryLocation == null
          ? "delivery"
          : "pickup"

        // Use setMarker for consistency
        setMarker(target, lat, lng, undefined)

        if (activeMode) setActiveMode(null)
      })

      if (!mounted) return
    })()

    return () => {
      mounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lockMarkers, activeMode, pickupLocation, deliveryLocation])

  // Reflect external initial props
  useEffect(() => {
    if (initialPickup) setMarker("pickup", initialPickup.lat, initialPickup.lng, initialPickup.address)
  }, [initialPickup])

  useEffect(() => {
    if (initialDelivery) setMarker("delivery", initialDelivery.lat, initialDelivery.lng, initialDelivery.address)
  }, [initialDelivery])

  // Notify parent when locations change
  useEffect(() => {
    if (onLocationsChange) onLocationsChange(pickupLocation, deliveryLocation)
  }, [pickupLocation, deliveryLocation, onLocationsChange])

  // Calculate distance and price when both points exist
  useEffect(() => {
    if (!pickupLocation || !deliveryLocation || !mapRef.current) return

    let canceled = false
    ;(async () => {
      const leaflet = await import("leaflet")
      const dist = leaflet
        .latLng(pickupLocation.lat, pickupLocation.lng)
        .distanceTo(leaflet.latLng(deliveryLocation.lat, deliveryLocation.lng))

      const distanceInKm = dist / 1000
      if (canceled) return
      setDistance(Number.parseFloat(distanceInKm.toFixed(2)))

      const basePrice = 50
      const pricePerKm = 2.5
      const calculatedPrice = basePrice + distanceInKm * pricePerKm
      setEstimatedPrice(Number.parseFloat(calculatedPrice.toFixed(2)))

      // Draw line between points
      if (routeLine.current) try { mapRef.current.removeLayer(routeLine.current) } catch {}
      routeLine.current = leaflet.polyline(
        [
          [pickupLocation.lat, pickupLocation.lng],
          [deliveryLocation.lat, deliveryLocation.lng],
        ],
        { color: "blue", weight: 3, opacity: 0.7, dashArray: "5, 5" },
      ).addTo(mapRef.current)

      // Fit map to bounds
      const bounds = leaflet.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [deliveryLocation.lat, deliveryLocation.lng],
      )
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    })()

    return () => {
      canceled = true
    }
  }, [pickupLocation, deliveryLocation])

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 animate-fade-in">
          <Card className="overflow-hidden shadow-lg">
            <div ref={mapContainer} className="h-96 lg:h-[500px] w-full rounded-lg" style={{ minHeight: "400px" }} />
          </Card>
        </div>

        {/* Booking Panel */}
        <div className="animate-slide-in-right">
          <Card className="shadow-lg sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t.mapBooking}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t.mapBooking}</p>
              </div>

              {/* Advanced settings panel */}
              <div className="mt-2 p-3 bg-muted/5 rounded-md border border-border">
                <button
                  className="text-sm font-medium underline"
                  onClick={() => setShowAdvanced((s) => !s)}
                >
                  {t.advancedSettings}
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-4">
                      <label className="text-sm">{t.lockMarkers}</label>
                      <input type="checkbox" checked={lockMarkers} onChange={() => setLockMarkers((s) => !s)} />
                      <label className="text-sm ml-4">{t.showCoords}</label>
                      <input type="checkbox" checked={showCoordsOnMarker} onChange={() => setShowCoordsOnMarker((s) => !s)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{t.pickupLocation}</div>
                        <div className="flex gap-2">
                          <input
                            className="w-1/2 border px-2 py-1 rounded"
                            placeholder={t.lat}
                            value={manualPickupLat}
                            onChange={(e) => setManualPickupLat(e.target.value)}
                          />
                          <input
                            className="w-1/2 border px-2 py-1 rounded"
                            placeholder={t.lng}
                            value={manualPickupLng}
                            onChange={(e) => setManualPickupLng(e.target.value)}
                          />
                        </div>
                        <div>
                          <button
                            className="btn-outline mt-2"
                            onClick={() => {
                              const lat = parseFloat(manualPickupLat)
                              const lng = parseFloat(manualPickupLng)
                              if (!isNaN(lat) && !isNaN(lng)) setMarker("pickup", lat, lng)
                            }}
                          >
                            {t.update}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{t.deliveryLocation}</div>
                        <div className="flex gap-2">
                          <input
                            className="w-1/2 border px-2 py-1 rounded"
                            placeholder={t.lat}
                            value={manualDeliveryLat}
                            onChange={(e) => setManualDeliveryLat(e.target.value)}
                          />
                          <input
                            className="w-1/2 border px-2 py-1 rounded"
                            placeholder={t.lng}
                            value={manualDeliveryLng}
                            onChange={(e) => setManualDeliveryLng(e.target.value)}
                          />
                        </div>
                        <div>
                          <button
                            className="btn-outline mt-2"
                            onClick={() => {
                              const lat = parseFloat(manualDeliveryLat)
                              const lng = parseFloat(manualDeliveryLng)
                              if (!isNaN(lat) && !isNaN(lng)) setMarker("delivery", lat, lng)
                            }}
                          >
                            {t.update}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex items-center gap-3">
                      <button className="btn-outline" onClick={() => clearPoints()}>{t.clearPoints}</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t.pickupLocation}</label>
                <Button
                  onClick={() => setActiveMode("pickup")}
                  variant={activeMode === "pickup" ? "default" : "outline"}
                  className="w-full justify-start gap-2 transition-all duration-300 hover:shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  {pickupLocation
                    ? `${pickupLocation.lat.toFixed(2)}, ${pickupLocation.lng.toFixed(2)}`
                    : t.pickupLocation}
                </Button>
              </div>

              {/* Delivery Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t.deliveryLocation}</label>
                <Button
                  onClick={() => setActiveMode("delivery")}
                  variant={activeMode === "delivery" ? "default" : "outline"}
                  className="w-full justify-start gap-2 transition-all duration-300 hover:shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  {deliveryLocation
                    ? `${deliveryLocation.lat.toFixed(2)}, ${deliveryLocation.lng.toFixed(2)}`
                    : t.deliveryLocation}
                </Button>
              </div>

              {/* Distance & Price */}
              {distance && estimatedPrice && (
                <div className="space-y-3 pt-4 border-t animate-scale-in">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t.distance}</p>
                    <p className="text-lg font-bold text-primary">{distance} km</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t.estimatedPrice}</p>
                    <p className="text-2xl font-bold text-accent">€{estimatedPrice}</p>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <Button
                disabled={!distance || !estimatedPrice}
                className="w-full mt-4 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                {t.bookService}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 animate-fade-in">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            {activeMode === "pickup"
              ? language === "de"
                ? "Klicke auf der Karte, um deinen Abholort zu wählen"
                : "Click on the map to select your pickup location"
              : activeMode === "delivery"
                ? language === "de"
                  ? "Klicke auf der Karte, um deinen Lieferort zu wählen"
                  : "Click on the map to select your delivery location"
                : language === "de"
                  ? "Klicke auf 'Abholort wählen' oder 'Lieferort wählen' und markiere dann deine Orte auf der Karte"
                  : "Click 'Choose Pickup Location' or 'Choose Delivery Location' and mark your locations on the map"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
