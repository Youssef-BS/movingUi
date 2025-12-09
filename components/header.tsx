"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const languages = [
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

export default function Header() {
  const [currentLang, setCurrentLang] = useState("de")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const translations = {
    de: {
      services: "Dienstleistungen",
      about: "Über Uns",
      reviews: "Bewertungen",
      team: "Team",
      login: "Anmelden",
      register: "Registrieren",
      booking: "Buchung",
    },
    en: {
      services: "Services",
      about: "About",
      reviews: "Reviews",
      team: "Team",
      login: "Login",
      register: "Register",
      booking: "Book Now",
    },
    fr: {
      services: "Services",
      about: "À Propos",
      reviews: "Avis",
      team: "Équipe",
      login: "Connexion",
      register: "S'inscrire",
      booking: "Réserver",
    },
  }

  const t = translations[currentLang as keyof typeof translations]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 animate-slide-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-bold text-xl text-primary transition-all duration-300 hover:text-accent"
          >
            K&A
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/services/moving" className="text-foreground hover:text-primary transition duration-300">
              {t.services}
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition duration-300">
              {t.about}
            </Link>
            <Link href="/reviews" className="text-foreground hover:text-primary transition duration-300">
              {t.reviews}
            </Link>
            <Link href="/team" className="text-foreground hover:text-primary transition duration-300">
              {t.team}
            </Link>
          </nav>

          {/* Language Selector & Auth */}
          <div className="flex gap-4 items-center">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition duration-300"
              >
                <span>{languages.find((l) => l.code === currentLang)?.flag}</span>
                <ChevronDown size={16} />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded-lg shadow-lg animate-scale-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setLangDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary transition duration-300 flex items-center gap-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:shadow-md bg-transparent"
              >
                {t.login}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="transition-all duration-300 hover:shadow-md">
                {t.register}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border animate-slide-in-up">
            <Link
              href="/services/moving"
              className="block py-2 text-foreground hover:text-primary transition duration-300"
            >
              {t.services}
            </Link>
            <Link href="/about" className="block py-2 text-foreground hover:text-primary transition duration-300">
              {t.about}
            </Link>
            <Link href="/reviews" className="block py-2 text-foreground hover:text-primary transition duration-300">
              {t.reviews}
            </Link>
            <Link href="/team" className="block py-2 text-foreground hover:text-primary transition duration-300">
              {t.team}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
