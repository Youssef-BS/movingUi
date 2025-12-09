"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Clock, Truck } from "lucide-react"

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Live Service Tracking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Interactive map simulation */}
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ddd" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="400" height="300" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Route visualization */}
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                    <line x1="50" y1="100" x2="350" y2="200" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,5" />
                    <circle cx="50" cy="100" r="12" fill="#3b82f6" />
                    <circle cx="200" cy="150" r="12" fill="#f59e0b" />
                    <circle cx="350" cy="200" r="12" fill="#10b981" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-6xl mb-2 animate-bounce">🚚</div>
                      <p className="font-semibold text-gray-700">Live Position</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup</p>
                      <p className="font-semibold">123 Main St, Berlin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Truck className="text-yellow-600" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p className="font-semibold">On the way - 52.47°N, 13.38°E</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <MapPin className="text-green-600" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Drop-off</p>
                      <p className="font-semibold">456 Oak Ave, Munich</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-semibold">Moving Service</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">January 15, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-yellow-600">On the Way</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimated Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-semibold text-lg">2h 15m</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Driver Phone</p>
                    <p className="font-semibold">+49 176 123456</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
