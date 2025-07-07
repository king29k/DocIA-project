"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock, Stethoscope } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { getTranslation } from "@/lib/translations"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useTheme()

  const t = (key: any) => getTranslation(language, key)

  useEffect(() => {
    // Vérifier si nous avons les paramètres nécessaires pour la réinitialisation
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")

    if (!accessToken || !refreshToken) {
      setError("Lien de réinitialisation invalide ou expiré.")
      return
    }

    // Définir la session avec les tokens
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }, [searchParams])

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

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

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setSuccess(t("passwordUpdated"))

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push("/auth")
      }, 2000)
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation:", error)
      setError(error.message || "Une erreur inattendue s'est produite.")
    } finally {
      setLoading(false)
    }
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
            <Link
              href="/auth"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-all duration-300 hover:scale-105 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              {t("backToHome")}
            </Link>

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
              <p className="text-white text-xl font-semibold">{t("resetPassword")}</p>
              <p className="text-blue-200 text-sm">Créez un nouveau mot de passe sécurisé</p>
            </div>
          </div>

          {/* Glassmorphism Card */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in-up delay-200">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                <Lock className="h-6 w-6 text-yellow-300 animate-pulse" />
                {t("resetPassword")}
              </CardTitle>
              <CardDescription className="text-blue-100">Entrez votre nouveau mot de passe ci-dessous</CardDescription>
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

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    {t("newPassword")}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                    <Input
                      id="password"
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
                    {t("confirmNewPassword")}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirmez votre nouveau mot de passe"
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
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-12 shadow-xl hover:scale-105 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                  {loading ? "Mise à jour..." : t("updatePassword")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Aide */}
          <div className="mt-8 text-center">
            <p className="text-blue-300 text-xs">© 2025 DocIA - Douala General Hospital. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
