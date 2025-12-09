"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

const L = dynamic(() => import("leaflet"), { ssr: false })

interface LocationPoint {
  lat: number
  lng: number
  address?: string
}

interface MapBookingProps {
  language?: Language
}

export function MapBooking({ language = "de" }: MapBookingProps) {
  const t = translations[language]
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [pickupLocation, setPickupLocation] = useState<LocationPoint | null>(null)
  const [deliveryLocation, setDeliveryLocation] = useState<LocationPoint | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [activeMode, setActiveMode] = useState<"pickup" | "delivery" | null>(null)
  const pickupMarker = useRef<any>(null)
  const deliveryMarker = useRef<any>(null)
  const routeLine = useRef<any>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
    ;(async () => {
      const L = await import("leaflet")
      const map = L.map(mapContainer.current!).setView([51.1657, 10.4515], 6)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      map.on("click", (e: any) => {
        if (!activeMode) return

        const { lat, lng } = e.latlng
        const location: LocationPoint = { lat, lng }

        if (activeMode === "pickup") {
          setPickupLocation(location)
          if (pickupMarker.current) map.removeLayer(pickupMarker.current)
          pickupMarker.current = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
              shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .addTo(map)
            .bindPopup(t.pickupLocation)
        } else {
          setDeliveryLocation(location)
          if (deliveryMarker.current) map.removeLayer(deliveryMarker.current)
          deliveryMarker.current = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
              shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .addTo(map)
            .bindPopup(t.deliveryLocation)
        }

        setActiveMode(null)
      })
    })()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [activeMode, t])

  // Calculate distance and price
  useEffect(() => {
    if (pickupLocation && deliveryLocation && mapRef.current) {
      const dist = L.latLng(pickupLocation.lat, pickupLocation.lng).distanceTo(
        L.latLng(deliveryLocation.lat, deliveryLocation.lng),
      )
      const distanceInKm = dist / 1000
      setDistance(Number.parseFloat(distanceInKm.toFixed(2)))

      const basePrice = 50
      const pricePerKm = 2.5
      const calculatedPrice = basePrice + distanceInKm * pricePerKm
      setEstimatedPrice(Number.parseFloat(calculatedPrice.toFixed(2)))

      // Draw line between points
      if (routeLine.current) mapRef.current.removeLayer(routeLine.current)
      routeLine.current = L.polyline(
        [
          [pickupLocation.lat, pickupLocation.lng],
          [deliveryLocation.lat, deliveryLocation.lng],
        ],
        { color: "blue", weight: 3, opacity: 0.7, dashArray: "5, 5" },
      ).addTo(mapRef.current)

      // Fit map to bounds
      const bounds = L.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [deliveryLocation.lat, deliveryLocation.lng],
      )
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
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
                    <p className="text-2xl font-bold text-accent">${estimatedPrice}</p>
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
