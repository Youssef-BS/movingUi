"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MapPin, ClipboardList, CheckCircle, ChevronLeft } from "lucide-react"
import { MapBooking } from "@/components/map-booking"
import { translations, type Language } from "@/lib/translations"

export default function BookingPage() {
  const [language, setLanguage] = useState<Language>("de")
  const [step, setStep] = useState(1)
  const t = translations[language]

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+49 123 456789",
    service: "moving",
    date: "2025-01-15",
    time: "09:00",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const steps = [
    { number: 1, title: language === "de" ? "Ihre Infos" : "Your Info", icon: ClipboardList },
    { number: 2, title: language === "de" ? "Service wählen" : "Select Service", icon: CheckCircle },
    { number: 3, title: language === "de" ? "Orte & Zeit" : "Location & Time", icon: MapPin },
    { number: 4, title: language === "de" ? "Bestätigung" : "Review & Confirm", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Language Selector */}
        <div className="flex gap-2 mb-8 justify-end animate-fade-in">
          <Button
            variant={language === "de" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("de")}
            className="transition-all duration-300"
          >
            Deutsch
          </Button>
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="transition-all duration-300"
          >
            English
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="mb-12 animate-slide-in-up">
          <div className="flex justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={s.number} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition duration-300 ${
                      step >= s.number ? "bg-primary text-white shadow-lg" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? <CheckCircle size={24} /> : <Icon size={24} />}
                  </div>
                  <p
                    className={`text-sm text-center transition duration-300 ${
                      step >= s.number ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </p>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 w-full mt-2 transition duration-500 ${
                        step > s.number ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 1: User Info */}
        {step === 1 && (
          <Card className="animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle>{language === "de" ? "Ihre Informationen" : "Your Information"}</CardTitle>
              <CardDescription>
                {language === "de" ? "Erzähle uns etwas über dich" : "Tell us about yourself"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "de" ? "Vollständiger Name" : "Full Name"}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={language === "de" ? "Max Mustermann" : "John Doe"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{language === "de" ? "Telefon" : "Phone"}</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <Card className="animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle>{language === "de" ? "Service wählen" : "Select Service"}</CardTitle>
              <CardDescription>
                {language === "de" ? "Welchen Service benötigst du?" : "What service do you need?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "moving",
                  titleDe: "Umzugsdienst",
                  titleEn: "Moving Service",
                },
                {
                  id: "cleaning",
                  titleDe: "Reinigungsdienst",
                  titleEn: "Cleaning Service",
                },
                {
                  id: "packing",
                  titleDe: "Verpackungsdienst",
                  titleEn: "Packing Service",
                },
              ].map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => handleInputChange("service", svc.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition duration-300 ${
                    formData.service === svc.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <span className="font-semibold">{language === "de" ? svc.titleDe : svc.titleEn}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location & Time with Interactive Map */}
        {step === 3 && (
          <Card className="animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle>{language === "de" ? "Ort & Zeit" : "Location & Time"}</CardTitle>
              <CardDescription>
                {language === "de"
                  ? "Wähle deine Orte auf der interaktiven Karte und Zeit"
                  : "Select your locations on the interactive map and time"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Interactive Map Component */}
              <div className="bg-white rounded-lg overflow-hidden">
                <MapBooking language={language} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{language === "de" ? "Datum" : "Date"}</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{language === "de" ? "Zeit" : "Time"}</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card className="animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle>{language === "de" ? "Buchung überprüfen" : "Review Your Booking"}</CardTitle>
              <CardDescription>
                {language === "de"
                  ? "Bitte überprüfe, ob alle Angaben korrekt sind"
                  : "Please confirm all details are correct"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg animate-scale-in">
                  <p className="text-sm text-muted-foreground mb-1">{language === "de" ? "Name" : "Name"}</p>
                  <p className="font-semibold">{formData.name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg animate-scale-in" style={{ animationDelay: "50ms" }}>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold">{formData.email}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg animate-scale-in" style={{ animationDelay: "100ms" }}>
                  <p className="text-sm text-muted-foreground mb-1">{language === "de" ? "Service" : "Service"}</p>
                  <p className="font-semibold capitalize">{formData.service}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg animate-scale-in" style={{ animationDelay: "150ms" }}>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "de" ? "Datum & Zeit" : "Date & Time"}
                  </p>
                  <p className="font-semibold">
                    {formData.date} {language === "de" ? "um" : "at"} {formData.time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4 justify-between animate-slide-in-up">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`transition-all duration-300 ${step === 1 ? "invisible" : ""}`}
          >
            <ChevronLeft size={18} className="mr-2" />
            {language === "de" ? "Zurück" : "Back"}
          </Button>
          <Button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1)
              } else {
                console.log("[v0] Booking confirmed:", formData)
              }
            }}
            size="lg"
            className="transition-all duration-300 hover:shadow-lg"
          >
            {step === 4
              ? language === "de"
                ? "Buchung bestätigen"
                : "Confirm Booking"
              : language === "de"
                ? "Weiter"
                : "Next"}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
