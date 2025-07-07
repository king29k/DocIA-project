import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./supabase"

// Client Supabase pour le navigateur
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  },
)

// Fonction pour tester la connexion Supabase
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("conversations").select("count").limit(1)

    if (error && error.code !== "PGRST116") {
      // PGRST116 = table doesn't exist, which is ok for connection test
      throw error
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error("Supabase connection test failed:", error)
    return {
      success: false,
      error: error.message || "Connection failed",
    }
  }
}

// Fonction de connexion avec retry
export const signInWithRetry = async (email: string, password: string, maxRetries = 3) => {
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Sign in attempt ${attempt}/${maxRetries}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        lastError = error

        // Ne pas retry pour certaines erreurs
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("Email not confirmed") ||
          error.message.includes("Too many requests")
        ) {
          throw error
        }

        // Attendre avant de retry
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
          continue
        }

        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      lastError = error

      if (attempt === maxRetries || (!error.message.includes("fetch") && !error.message.includes("network"))) {
        throw error
      }

      // Attendre avant de retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw lastError
}

// Fonction d'inscription avec retry
export const signUpWithRetry = async (email: string, password: string, maxRetries = 3) => {
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Sign up attempt ${attempt}/${maxRetries}`)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      })

      if (error) {
        lastError = error

        // Ne pas retry pour certaines erreurs
        if (
          error.message.includes("User already registered") ||
          error.message.includes("Password should be at least")
        ) {
          throw error
        }

        // Attendre avant de retry
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
          continue
        }

        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      lastError = error

      if (attempt === maxRetries || (!error.message.includes("fetch") && !error.message.includes("network"))) {
        throw error
      }

      // Attendre avant de retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw lastError
}
