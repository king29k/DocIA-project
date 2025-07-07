"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
  User,
  Lock,
  Sparkles,
  Shield,
  Heart,
  Stethoscope,
} from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { getTranslation } from "@/lib/translations"
import { LanguageToggle } from "@/components/language-toggle"

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("signin")
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [initialLoading, setInitialLoading] = useState(true)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const router = useRouter()
  const { language } = useTheme()

  const t = (key: any) => getTranslation(language, key)

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      console.log("Auth page - Checking session:", !!session)

      if (session && !error) {
        console.log("Auth page - User already logged in, redirecting to chat")
        router.push("/chat")
        return
      }

      setConnectionStatus("connected")
    } catch (error) {
      console.error("Auth page - Session check error:", error)
      setConnectionStatus("disconnected")
    } finally {
      setInitialLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    clearMessages()

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/chat`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Erreur lors de la connexion Google:", error)
      if (error.message.includes("fetch")) {
        setError("Problème de connexion réseau. Vérifiez votre connexion internet et réessayez.")
      } else {
        setError("Erreur lors de la connexion avec Google. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    if (!validateEmail(email)) {
      setError(t("enterValidEmail"))
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError(t("passwordMinLength"))
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        switch (error.message) {
          case "Invalid login credentials":
            setError(t("invalidCredentials"))
            break
          case "Email not confirmed":
            setError(t("emailNotConfirmed"))
            break
          case "Too many requests":
            setError(t("tooManyRequests"))
            break
          default:
            setError(`Erreur de connexion: ${error.message}`)
        }
        return
      }

      if (data.user && data.session) {
        setSuccess(t("connectionSuccess"))
        setTimeout(() => {
          router.push("/chat")
          router.refresh()
        }, 1000)
      }
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error)
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    if (!validateEmail(email)) {
      setError(t("enterValidEmail"))
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError(t("passwordMinLength"))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError(t("passwordsNotMatch"))
      setLoading(false)
      return
    }

    if (!fullName.trim()) {
      setError(t("enterFullName"))
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
          data: {
            full_name: fullName.trim(),
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=0d9488&color=fff`,
          },
        },
      })

      if (error) {
        switch (error.message) {
          case "User already registered":
            setError(t("userAlreadyExists"))
            break
          case "Password should be at least 6 characters":
            setError(t("passwordMinLength"))
            break
          default:
            setError(`Erreur d'inscription: ${error.message}`)
        }
        return
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          setSuccess(t("accountCreated"))
          setTimeout(() => {
            router.push("/chat")
          }, 1000)
        } else {
          setSuccess(t("checkEmailConfirm"))
          setActiveTab("signin")
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error)
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError("Veuillez entrer votre adresse email.")
      return
    }

    if (!validateEmail(resetEmail)) {
      setError(t("enterValidEmail"))
      return
    }

    setResetLoading(true)
    clearMessages()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(`Erreur: ${error.message}`)
        return
      }

      setSuccess(t("resetEmailSent"))
      setResetPasswordOpen(false)
      setResetEmail("")
    } catch (error: any) {
      setError("Erreur lors de l'envoi de l'email de réinitialisation.")
    } finally {
      setResetLoading(false)
    }
  }

  // Afficher un loader pendant la vérification de session
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="text-center text-white relative z-10">
          <div className="relative mx-auto w-20 h-20 mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 bg-white/30 rounded-full animate-ping delay-75"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-5 shadow-2xl">
              <Stethoscope className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <p className="text-xl font-medium animate-pulse">{t("sessionCheck")}</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-float-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-white/10 rounded-full animate-float-slow delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 hover:scale-105 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                {t("backToHome")}
              </Link>
              <LanguageToggle />
            </div>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-75"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                  <Stethoscope className="h-12 w-12 text-indigo-600" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  DocIA
                </h1>
                <p className="text-blue-200 text-sm font-medium">{t("intelligentHealthAssistant")}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-white text-xl font-semibold">{t("welcomeToHealthSpace")}</p>
              <p className="text-blue-200 text-sm">{t("connectToAccess")}</p>
            </div>

            {/* Statut de connexion */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {connectionStatus === "checking" && (
                <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20 animate-pulse">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  {t("checking")}
                </Badge>
              )}
              {connectionStatus === "connected" && (
                <Badge className="bg-green-500/20 backdrop-blur-sm text-green-100 border-green-400/30 animate-fade-in">
                  <Wifi className="h-3 w-3 mr-1" />
                  {t("connected")}
                </Badge>
              )}
              {connectionStatus === "disconnected" && (
                <Badge className="bg-red-500/20 backdrop-blur-sm text-red-100 border-red-400/30 animate-shake">
                  <WifiOff className="h-3 w-3 mr-1" />
                  {t("disconnected")}
                </Badge>
              )}
            </div>
          </div>

          {/* Glassmorphism Card */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in-up delay-200">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                {t("secureAccess")}
              </CardTitle>
              <CardDescription className="text-blue-100">{t("connectOrCreate")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Messages d'erreur et de succès */}
              {error && (
                <Alert className="border-red-300/50 bg-red-500/10 backdrop-blur-sm animate-shake">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertDescription className="text-red-100">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-300/50 bg-green-500/10 backdrop-blur-sm animate-fade-in">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <AlertDescription className="text-green-100">{success}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/20">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-300"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {t("connection")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("registration")}
                  </TabsTrigger>
                </TabsList>

                {/* Google Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading || connectionStatus === "disconnected"}
                  className="w-full mb-6 bg-white/90 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white hover:scale-105 shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {loading ? "Connexion..." : t("continueWithGoogle")}
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-3 text-white/70 font-medium">{t("orWithEmail")}</span>
                  </div>
                </div>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">
                        {t("emailAddress")}
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white font-medium">
                        {t("password")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="pl-10 pr-12 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-white/70" />
                          ) : (
                            <Eye className="h-4 w-4 text-white/70" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="link"
                            className="text-sm text-blue-200 hover:text-white p-0 transition-colors"
                            disabled={loading}
                          >
                            {t("forgotPassword")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-white">{t("resetPassword")}</DialogTitle>
                            <DialogDescription className="text-white/70">{t("resetPasswordDesc")}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="reset-email" className="text-white">
                                {t("emailAddress")}
                              </Label>
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="votre@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50"
                              />
                            </div>
                            <Button
                              onClick={handleForgotPassword}
                              disabled={resetLoading || !resetEmail}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                            >
                              {resetLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Mail className="w-4 h-4 mr-2" />
                              )}
                              {t("sendResetLink")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-12 shadow-xl hover:scale-105 transition-all duration-300"
                      disabled={loading || connectionStatus === "disconnected"}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      {loading ? "Connexion..." : t("signIn")}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-white font-medium">
                        {t("fullName")}
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Votre nom complet"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white font-medium">
                        {t("emailAddress")}
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white font-medium">
                        {t("password")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 6 caractères"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="pl-10 pr-12 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-white/70" />
                          ) : (
                            <Eye className="h-4 w-4 text-white/70" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white font-medium">
                        {t("confirmPassword")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirmez votre mot de passe"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 shadow-xl hover:scale-105 transition-all duration-300"
                      disabled={loading || connectionStatus === "disconnected"}
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
                      {loading ? "Création..." : t("createAccount")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-white/70">
                <p>
                  {t("acceptTerms")}{" "}
                  <Link href="/terms" className="text-blue-200 hover:text-white font-medium transition-colors">
                    {t("termsOfUse")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link href="/privacy" className="text-blue-200 hover:text-white font-medium transition-colors">
                    {t("privacyPolicy")}
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Aide */}
          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-6 text-blue-200 text-sm">
              <Link
                href="/support"
                className="hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-1 group"
              >
                <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                {t("support")}
              </Link>
              <Link
                href="/auth/debug"
                className="hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-1 group"
              >
                <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                {t("diagnostic")}
              </Link>
            </div>
            <p className="text-blue-300 text-xs">{t("copyright")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
