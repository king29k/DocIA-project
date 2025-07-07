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
  const router = useRouter()

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
      setError("Veuillez entrer une adresse email valide.")
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
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
            setError("Email ou mot de passe incorrect. Vérifiez vos identifiants.")
            break
          case "Email not confirmed":
            setError("Veuillez confirmer votre email avant de vous connecter.")
            break
          case "Too many requests":
            setError("Trop de tentatives de connexion. Veuillez patienter quelques minutes.")
            break
          default:
            setError(`Erreur de connexion: ${error.message}`)
        }
        return
      }

      if (data.user && data.session) {
        setSuccess("Connexion réussie ! Redirection en cours...")
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
      setError("Veuillez entrer une adresse email valide.")
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      setLoading(false)
      return
    }

    if (!fullName.trim()) {
      setError("Veuillez entrer votre nom complet.")
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
            setError("Un compte existe déjà avec cette adresse email.")
            break
          case "Password should be at least 6 characters":
            setError("Le mot de passe doit contenir au moins 6 caractères.")
            break
          default:
            setError(`Erreur d'inscription: ${error.message}`)
        }
        return
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          setSuccess("Compte créé avec succès ! Redirection en cours...")
          setTimeout(() => {
            router.push("/chat")
          }, 1000)
        } else {
          setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.")
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
      setError("Veuillez entrer une adresse email valide.")
      return
    }

    setLoading(true)
    clearMessages()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(`Erreur: ${error.message}`)
        return
      }

      setSuccess("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.")
      setResetPasswordOpen(false)
      setResetEmail("")
    } catch (error: any) {
      setError("Erreur lors de l'envoi de l'email de réinitialisation.")
    } finally {
      setLoading(false)
    }
  }

  // Afficher un loader pendant la vérification de session
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            <div className="relative bg-white rounded-full p-4">
              <Stethoscope className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <p className="text-lg">Vérification de votre session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                <div className="relative bg-white rounded-full p-4 shadow-2xl">
                  <Stethoscope className="h-12 w-12 text-teal-600" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-1">DocIA</h1>
                <p className="text-teal-200 text-sm">Assistant Santé Intelligent</p>
              </div>
            </div>

            <p className="text-teal-100 text-lg mb-2">Bienvenue dans votre espace santé</p>
            <p className="text-teal-200 text-sm">Connectez-vous pour accéder à votre assistant médical personnel</p>

            {/* Statut de connexion */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {connectionStatus === "checking" && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Vérification...
                </Badge>
              )}
              {connectionStatus === "connected" && (
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connecté
                </Badge>
              )}
              {connectionStatus === "disconnected" && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-100 border-red-400/30">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Déconnecté
                </Badge>
              )}
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-teal-900 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-teal-600" />
                Accès Sécurisé
              </CardTitle>
              <CardDescription className="text-gray-600">
                Connectez-vous ou créez un compte pour commencer votre suivi médical
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Messages d'erreur et de succès */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white">
                    <Lock className="h-4 w-4 mr-2" />
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white">
                    <User className="h-4 w-4 mr-2" />
                    Inscription
                  </TabsTrigger>
                </TabsList>

                {/* Google Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading || connectionStatus === "disconnected"}
                  className="w-full mb-6 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-md"
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
                  {loading ? "Connexion..." : "Continuer avec Google"}
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">Ou avec votre email</span>
                  </div>
                </div>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Adresse email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="pl-10 pr-12 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
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
                            className="text-sm text-teal-600 hover:text-teal-700 p-0"
                            disabled={loading}
                          >
                            Mot de passe oublié ?
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                            <DialogDescription>
                              Entrez votre adresse email pour recevoir un lien de réinitialisation.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="reset-email">Adresse email</Label>
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="votre@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                              />
                            </div>
                            <Button
                              onClick={handleForgotPassword}
                              disabled={loading || !resetEmail}
                              className="w-full bg-teal-600 hover:bg-teal-700"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Mail className="w-4 h-4 mr-2" />
                              )}
                              Envoyer le lien
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-12 shadow-lg"
                      disabled={loading || connectionStatus === "disconnected"}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                        Nom complet
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Votre nom complet"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                        Adresse email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 6 caractères"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="pl-10 pr-12 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirmez votre mot de passe"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="pl-10 h-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-12 shadow-lg"
                      disabled={loading || connectionStatus === "disconnected"}
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
                      {loading ? "Création..." : "Créer mon compte"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  En continuant, vous acceptez nos{" "}
                  <Link href="/terms" className="text-teal-600 hover:underline font-medium">
                    conditions d'utilisation
                  </Link>{" "}
                  et notre{" "}
                  <Link href="/privacy" className="text-teal-600 hover:underline font-medium">
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Aide */}
          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-6 text-teal-200 text-sm">
              <Link href="/support" className="hover:text-white transition-colors flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Support
              </Link>
              <Link href="/auth/debug" className="hover:text-white transition-colors flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Diagnostic
              </Link>
            </div>
            <p className="text-teal-300 text-xs">© 2025 DocIA - Douala General Hospital. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
