"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Truck, Sparkles, MapPin, Users, Clock, CheckCircle } from "lucide-react"
import { translations, type Language } from "@/lib/translations"
import { useState } from "react"

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("de")
  const t = translations[language]

  const services = [
    {
      icon: Truck,
      title: t.movingServices,
      description: t.movingDescription,
      link: "/services/moving",
    },
    {
      icon: Sparkles,
      title: t.cleaningServices,
      description: t.cleaningDescription,
      link: "/services/cleaning",
    },
    {
      icon: MapPin,
      title: t.packingServices,
      description: t.packingDescription,
      link: "/services/packing",
    },
  ]

  const features = [
    {
      icon: Users,
      title: t.expertTeam,
      description: t.expertTeamDesc,
    },
    {
      icon: Clock,
      title: t.quickService,
      description: t.quickServiceDesc,
    },
    {
      icon: CheckCircle,
      title: t.qualityAssured,
      description: t.qualityAssuredDesc,
    },
  ]

  const testimonials = [
    {
      name: "Maria Schmidt",
      role: "Berlin",
      content: t.testimonial1,
    },
    {
      name: "Hans Mueller",
      role: "Munich",
      content: t.testimonial2,
    },
    {
      name: "Sarah Weber",
      role: "Frankfurt",
      content: t.testimonial3,
    },
  ]

  return (
    <div className="w-full">
      {/* Language Selector */}
      <div className="fixed top-24 right-4 z-40 flex gap-2 animate-fade-in">
        <Button
          variant={language === "de" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("de")}
          className="transition-all duration-300 hover:shadow-md"
        >
          Deutsch
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("en")}
          className="transition-all duration-300 hover:shadow-md"
        >
          English
        </Button>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20 animate-fade-in overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-slide-in-up">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto text-balance animate-slide-in-up">
              {t.heroDescription}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {t.bookNow}
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/services/moving">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/20 bg-transparent transition-all duration-300 transform hover:scale-105"
                >
                  {t.learnMore}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in text-balance">
            {language === "de" ? "Unsere Dienstleistungen" : "Our Services"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Link key={service.title} href={service.link}>
                  <Card
                    className="h-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-in-up cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardHeader>
                      <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit transform transition-all duration-300 hover:scale-110">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in text-balance">
            {language === "de" ? "Warum K&A?" : "Why Choose K&A?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="text-center animate-scale-in"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="mb-4 p-4 bg-primary/10 rounded-full w-fit mx-auto transform transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in text-balance">{t.whatCustomersSay}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="animate-slide-in-up transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="animate-pulse-slow text-lg"
                        style={{
                          animationDelay: `${i * 100}ms`,
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white animate-fade-in overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-slide-in-up">{t.readyToMove}</h2>
          <p className="text-xl mb-8 text-blue-100 animate-slide-in-up">{t.startBooking}</p>
          <Link href="/booking" className="inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-in-up"
              style={{ animationDelay: "200ms" }}
            >
              {t.bookYourService}
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
