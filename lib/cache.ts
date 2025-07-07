"use client"

import { useEffect } from "react"

import { useState } from "react"

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttlMinutes = 30): void {
    const ttl = ttlMinutes * 60 * 1000 // Convertir en millisecondes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // Vérifier si l'élément a expiré
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Nettoyer les éléments expirés
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new MemoryCache()

// Nettoyer le cache toutes les 10 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      cache.cleanup()
    },
    10 * 60 * 1000,
  )
}

// Hook pour utiliser le cache avec React
export function useCache<T>(key: string, fetcher: () => Promise<T>, ttlMinutes = 30) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Vérifier le cache d'abord
      const cached = cache.get<T>(key)
      if (cached) {
        setData(cached)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        cache.set(key, result, ttlMinutes)
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [key, ttlMinutes])

  return { data, loading, error }
}
