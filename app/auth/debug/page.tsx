"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { supabase, testSupabaseConnection } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw, Copy } from "lucide-react"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

export default function AuthDebugPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(true)
  const [systemInfo, setSystemInfo] = useState<any>(null)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    const results: DiagnosticResult[] = []

    // Test 1: Variables d'environnement
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        results.push({
          name: "Variables d'environnement",
          status: "error",
          message: "Variables Supabase manquantes",
          details: `URL: ${supabaseUrl ? "✓" : "✗"}, Key: ${supabaseKey ? "✓" : "✗"}`,
        })
      } else {
        results.push({
          name: "Variables d'environnement",
          status: "success",
          message: "Variables Supabase configurées",
          details: `URL: ${supabaseUrl.substring(0, 30)}..., Key: ${supabaseKey.substring(0, 30)}...`,
        })
      }
    } catch (error) {
      results.push({
        name: "Variables d'environnement",
        status: "error",
        message: "Erreur lors de la vérification",
        details: String(error),
      })
    }

    // Test 2: Connexion Supabase
    try {
      const connectionTest = await testSupabaseConnection()
      if (connectionTest.success) {
        results.push({
          name: "Connexion Supabase",
          status: "success",
          message: "Connexion établie avec succès",
        })
      } else {
        results.push({
          name: "Connexion Supabase",
          status: "error",
          message: "Échec de la connexion",
          details: connectionTest.error || "Erreur inconnue",
        })
      }
    } catch (error) {
      results.push({
        name: "Connexion Supabase",
        status: "error",
        message: "Erreur de connexion",
        details: String(error),
      })
    }

    // Test 3: Session utilisateur
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        results.push({
          name: "Session utilisateur",
          status: "error",
          message: "Erreur lors de la récupération de session",
          details: error.message,
        })
      } else if (session) {
        results.push({
          name: "Session utilisateur",
          status: "success",
          message: "Utilisateur connecté",
          details: `ID: ${session.user.id}, Email: ${session.user.email}`,
        })
      } else {
        results.push({
          name: "Session utilisateur",
          status: "warning",
          message: "Aucune session active",
          details: "L'utilisateur n'est pas connecté",
        })
      }
    } catch (error) {
      results.push({
        name: "Session utilisateur",
        status: "error",
        message: "Erreur lors de la vérification de session",
        details: String(error),
      })
    }

    // Test 4: Cookies et stockage local
    try {
      const cookies = document.cookie
      const localStorage = window.localStorage
      const sessionStorage = window.sessionStorage

      results.push({
        name: "Stockage navigateur",
        status: "success",
        message: "Stockage disponible",
        details: `Cookies: ${cookies ? "✓" : "✗"}, LocalStorage: ${localStorage ? "✓" : "✗"}, SessionStorage: ${sessionStorage ? "✓" : "✗"}`,
      })
    } catch (error) {
      results.push({
        name: "Stockage navigateur",
        status: "error",
        message: "Problème de stockage",
        details: String(error),
      })
    }

    // Informations système
    const info = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    }

    setSystemInfo(info)
    setDiagnostics(results)
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>
      case "error":
        return <Badge variant="destructive">Erreur</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth" className="inline-flex items-center text-white hover:text-teal-200 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'authentification
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Diagnostic Système</h1>
          <p className="text-teal-200">Vérification de la configuration et des connexions</p>
        </div>

        {/* Diagnostics */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-teal-900">Tests de Diagnostic</CardTitle>
                <CardDescription>Vérification des composants système</CardDescription>
              </div>
              <Button onClick={runDiagnostics} disabled={loading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
                <p className="text-gray-600">Exécution des tests de diagnostic...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diagnostics.map((diagnostic, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(diagnostic.status)}
                        <h3 className="font-semibold text-gray-900">{diagnostic.name}</h3>
                      </div>
                      {getStatusBadge(diagnostic.status)}
                    </div>
                    <p className="text-gray-700 mb-2">{diagnostic.message}</p>
                    {diagnostic.details && (
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 font-mono">{diagnostic.details}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations système */}
        {systemInfo && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-teal-900">Informations Système</CardTitle>
              <CardDescription>Détails techniques pour le support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">User Agent</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 bg-gray-50 rounded p-2 text-xs break-all">{systemInfo.userAgent}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(systemInfo.userAgent)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">URL Actuelle</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 bg-gray-50 rounded p-2 text-xs break-all">{systemInfo.url}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(systemInfo.url)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Supabase URL</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 bg-gray-50 rounded p-2 text-xs break-all">{systemInfo.supabaseUrl}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(systemInfo.supabaseUrl)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Timestamp</Label>
                  <code className="block bg-gray-50 rounded p-2 text-xs mt-1">{systemInfo.timestamp}</code>
                </div>
              </div>

              <Separator className="my-6" />

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Si vous rencontrez des problèmes persistants, copiez ces informations et contactez le support
                  technique.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
