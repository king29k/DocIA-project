#!/usr/bin/env node

/**
 * Script de test de déploiement DocIA
 * Vérifie que tous les services sont opérationnels
 */

const https = require("https")
const http = require("http")

const config = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  mistralKey: process.env.MISTRAL_API_KEY,
}

console.log("🚀 Test de déploiement DocIA")
console.log("================================")

async function testEndpoint(url, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http
    const startTime = Date.now()

    client
      .get(url, (res) => {
        const responseTime = Date.now() - startTime
        const success = res.statusCode === expectedStatus

        resolve({
          url,
          status: res.statusCode,
          responseTime,
          success,
          headers: res.headers,
        })
      })
      .on("error", (err) => {
        reject({ url, error: err.message })
      })
  })
}

async function testSupabase() {
  console.log("\n📊 Test Supabase...")

  try {
    const result = await testEndpoint(`${config.supabaseUrl}/rest/v1/`, 200)
    console.log(`✅ Supabase API: ${result.status} (${result.responseTime}ms)`)
    return true
  } catch (error) {
    console.log(`❌ Supabase API: ${error.error}`)
    return false
  }
}

async function testMistralAPI() {
  console.log("\n🤖 Test Mistral AI...")

  if (!config.mistralKey) {
    console.log("⚠️  Clé Mistral AI non configurée")
    return false
  }

  try {
    const result = await testEndpoint("https://api.mistral.ai/v1/models", 200)
    console.log(`✅ Mistral AI: ${result.status} (${result.responseTime}ms)`)
    return true
  } catch (error) {
    console.log(`❌ Mistral AI: ${error.error}`)
    return false
  }
}

async function testApplication() {
  console.log("\n🌐 Test Application...")

  const endpoints = [
    { path: "/", name: "Page d'accueil" },
    { path: "/auth", name: "Page d'authentification" },
    { path: "/api/health", name: "Health check" },
  ]

  const results = []

  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(`${config.baseUrl}${endpoint.path}`)
      console.log(`✅ ${endpoint.name}: ${result.status} (${result.responseTime}ms)`)
      results.push({ ...endpoint, success: true, ...result })
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.error}`)
      results.push({ ...endpoint, success: false, error: error.error })
    }
  }

  return results.every((r) => r.success)
}

async function testDatabase() {
  console.log("\n🗄️  Test Base de données...")

  try {
    // Test simple de connexion via l'API Supabase
    const result = await testEndpoint(`${config.supabaseUrl}/rest/v1/conversations?select=count&limit=1`, 200)
    console.log(`✅ Base de données: Connexion OK (${result.responseTime}ms)`)
    return true
  } catch (error) {
    console.log(`❌ Base de données: ${error.error}`)
    return false
  }
}

async function generateReport(results) {
  console.log("\n📋 Rapport de test")
  console.log("==================")

  const allPassed = Object.values(results).every(Boolean)

  console.log(`Supabase API: ${results.supabase ? "✅" : "❌"}`)
  console.log(`Mistral AI: ${results.mistral ? "✅" : "❌"}`)
  console.log(`Application: ${results.app ? "✅" : "❌"}`)
  console.log(`Base de données: ${results.database ? "✅" : "❌"}`)

  console.log(`\n${allPassed ? "🎉" : "⚠️"} Résultat global: ${allPassed ? "SUCCÈS" : "ÉCHEC"}`)

  if (!allPassed) {
    console.log("\n🔧 Actions recommandées:")
    if (!results.supabase) console.log("- Vérifier la configuration Supabase")
    if (!results.mistral) console.log("- Vérifier la clé API Mistral")
    if (!results.app) console.log("- Vérifier le déploiement de l'application")
    if (!results.database) console.log("- Vérifier la base de données et les politiques RLS")
  }

  return allPassed
}

async function main() {
  try {
    const results = {
      supabase: await testSupabase(),
      mistral: await testMistralAPI(),
      app: await testApplication(),
      database: await testDatabase(),
    }

    const success = await generateReport(results)
    process.exit(success ? 0 : 1)
  } catch (error) {
    console.error("\n💥 Erreur lors des tests:", error)
    process.exit(1)
  }
}

// Exécuter les tests
main()
