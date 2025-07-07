"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MessageCircle,
  Shield,
  Clock,
  Users,
  Brain,
  Settings,
  ChevronDown,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { getTranslation } from "@/lib/translations"
import { LanguageToggle } from "@/components/language-toggle"

// Composant pour les statistiques animées
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

// Composant pour l'effet de typing
function TypingEffect({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useTheme()

  const t = (key: any) => getTranslation(language, key)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="bg-teal-800 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10">
          <nav className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                <Image
                  src="/images/logo.png"
                  alt="DocIA Logo"
                  width={40}
                  height={40}
                  className="rounded-full relative z-10 transition-transform group-hover:scale-110"
                />
              </div>
              <span className="text-xl font-bold">DocIA</span>
            </div>
            <div
              className={`hidden md:flex items-center space-x-8 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}
            >
              <Link
                href="#accueil"
                className="hover:text-teal-200 transition-all duration-300 hover:scale-105 relative group"
              >
                {t("home")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#about"
                className="hover:text-teal-200 transition-all duration-300 hover:scale-105 relative group"
              >
                {t("about")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-teal-200 transition-all duration-300 hover:scale-105">
                  <span>{t("services")}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-sm text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Link href="#features" className="block px-4 py-3 hover:bg-teal-50 rounded-t-lg transition-colors">
                    {t("features")}
                  </Link>
                  <Link href="#precision" className="block px-4 py-3 hover:bg-teal-50 transition-colors">
                    {t("diagnostic")}
                  </Link>
                  <Link href="#support" className="block px-4 py-3 hover:bg-teal-50 rounded-b-lg transition-colors">
                    {t("support")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <Link
                href="/auth"
                className={`transition-all duration-1000 delay-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
              >
                <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {t("login")}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="bg-teal-800 text-white py-20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-6 transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                <TypingEffect text={t("heroTitle")} speed={80} />
              </h1>
              <p
                className={`text-lg text-teal-100 leading-relaxed max-w-md transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
              >
                {t("heroDescription")}
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
              >
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    {t("startNow")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-teal-800 px-8 py-3 rounded-full bg-transparent hover:scale-105 transition-all duration-300"
                >
                  {t("learnMore")}
                </Button>
              </div>

              {/* Statistiques animées */}
              <div
                className={`grid grid-cols-3 gap-4 pt-8 transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-200">
                    <AnimatedCounter end={10000} suffix="+" />
                  </div>
                  <div className="text-sm text-teal-300">{t("patients")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-200">
                    <AnimatedCounter end={95} suffix="%" />
                  </div>
                  <div className="text-sm text-teal-300">{t("satisfaction")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-200">
                    <AnimatedCounter end={24} suffix="/7" />
                  </div>
                  <div className="text-sm text-teal-300">{t("available")}</div>
                </div>
              </div>
            </div>
            <div
              className={`relative transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <div className="bg-gray-200 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-24 h-24 bg-gray-400 rounded-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 duration-300">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Placeholder"
                    width={96}
                    height={96}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-pink-50 py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 max-w-4xl mx-auto animate-fade-in-up">
              {t("featuresTitle")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: t("conversationTitle"),
                description: t("conversationDesc"),
                delay: "delay-100",
              },
              {
                icon: Settings,
                title: t("questionsTitle"),
                description: t("questionsDesc"),
                delay: "delay-300",
              },
              {
                icon: Shield,
                title: t("experienceTitle"),
                description: t("experienceDesc"),
                delay: "delay-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`text-center p-8 border-0 shadow-sm bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${feature.delay} group`}
              >
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-teal-100 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-gray-600 group-hover:text-teal-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                  <Button
                    variant="link"
                    className="text-teal-600 p-0 group-hover:scale-110 transition-transform duration-300"
                  >
                    {t("startNow")} →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Precision Section */}
      <section id="precision" className="bg-white py-20 relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-teal-100 rounded-full opacity-50 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-30 animate-float-delayed"></div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <p className="text-sm text-gray-500 mb-2 animate-fade-in">{t("precision")}</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up delay-100">
                {t("precisionTitle")}
              </h2>
              <p className="text-gray-600 text-lg mb-8 animate-fade-in-up delay-200">{t("precisionDesc")}</p>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="animate-fade-in-up delay-300 group">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center group-hover:text-teal-600 transition-colors">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    {t("reliableDiagnostic")}
                  </h4>
                  <p className="text-gray-600 text-sm">{t("reliableDiagnosticDesc")}</p>
                </div>
                <div className="animate-fade-in-up delay-400 group">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center group-hover:text-teal-600 transition-colors">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    {t("empathicSupport")}
                  </h4>
                  <p className="text-gray-600 text-sm">{t("empathicSupportDesc")}</p>
                </div>
              </div>
              <div className="flex gap-4 animate-fade-in-up delay-500">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300">
                  {t("tryNow")}
                </Button>
                <Button
                  variant="link"
                  className="text-gray-900 p-0 hover:scale-105 transition-transform duration-300 group"
                >
                  {t("learnMore")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="bg-gray-200 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-24 h-24 bg-gray-400 rounded-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 duration-300">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Placeholder"
                    width={96}
                    height={96}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="support" className="bg-blue-50 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-200/20 rounded-full blur-2xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              {t("supportFeaturesTitle")}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto animate-fade-in-up delay-200">
              {t("supportFeaturesDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: t("assistance247Title"),
                description: t("assistance247Desc"),
                delay: "delay-100",
              },
              {
                icon: Brain,
                title: t("personalizedTitle"),
                description: t("personalizedDesc"),
                delay: "delay-300",
              },
              {
                icon: Users,
                title: t("intuitiveTitle"),
                description: t("intuitiveDesc"),
                delay: "delay-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`text-center p-8 border-0 shadow-sm bg-white hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${feature.delay} group`}
              >
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto group-hover:bg-blue-100 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up delay-700">
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full bg-transparent hover:scale-105 transition-all duration-300"
              >
                {t("learnMore")}
              </Button>
              <Button
                variant="link"
                className="text-gray-900 p-0 hover:scale-105 transition-transform duration-300 group"
              >
                {t("startNow")}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">{t("ctaTitle")}</h2>
          <p className="text-gray-600 text-lg mb-8 animate-fade-in-up delay-200">{t("ctaDesc")}</p>
          <Link href="/auth" className="animate-fade-in-up delay-400 inline-block">
            <Button
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              {t("getStarted")}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Blog Section */}
      <section id="about" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 animate-fade-in-up">
            <p className="text-sm text-gray-500 mb-2">{t("blog")}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("healthResources")}</h2>
            <p className="text-gray-600 max-w-2xl">{t("healthResourcesDesc")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Design",
                title: t("medicationsTitle"),
                description: t("medicationsDesc"),
                delay: "delay-100",
              },
              {
                category: "Research",
                title: t("healthyLifeTitle"),
                description: t("healthyLifeDesc"),
                delay: "delay-300",
              },
              {
                category: "Frameworks",
                title: t("resultsTitle"),
                description: t("resultsDesc"),
                delay: "delay-500",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className={`border-0 shadow-sm bg-white overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${article.delay} group`}
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 duration-300">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Placeholder"
                      width={64}
                      height={64}
                      className="opacity-50"
                    />
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-800 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                  <Button
                    variant="link"
                    className="text-teal-600 p-0 group-hover:scale-110 transition-transform duration-300"
                  >
                    {t("learnMore")} →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/images/logo.png" alt="DocIA Logo" width={32} height={32} className="rounded-full" />
                <span className="text-xl font-bold">DocIA</span>
              </div>
              <p className="text-teal-200 text-sm mb-4">{t("heroDescription")}</p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map((social, index) => (
                  <div
                    key={social}
                    className={`w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition-all duration-300 hover:scale-110 animate-fade-in-up delay-${(index + 1) * 100}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full opacity-70"></div>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: t("product"),
                links: [t("features"), "Tarifs", "Sécurité", "Mises à jour"],
                delay: "delay-200",
              },
              {
                title: t("company"),
                links: [t("about"), t("blog"), "Carrières", "Presse"],
                delay: "delay-300",
              },
              {
                title: t("resources"),
                links: ["Documentation", "Aide", "Statut", "API"],
                delay: "delay-400",
              },
              {
                title: t("legal"),
                links: ["Confidentialité", "Conditions", "Cookies", "Licences"],
                delay: "delay-500",
              },
            ].map((column, index) => (
              <div key={index} className={`animate-fade-in-up ${column.delay}`}>
                <h4 className="font-bold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="text-teal-200 hover:text-white text-sm transition-all duration-300 hover:scale-105 inline-block"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-teal-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-in-up delay-600">
            <p className="text-teal-200 text-sm">{t("copyright")}</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-teal-200 text-sm">{t("subscribeDesc")}</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t("enterEmail")}
                  className="px-4 py-2 rounded-l-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-all duration-300"
                />
                <Button className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-r-full hover:scale-105 transition-all duration-300">
                  {t("subscribe")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
