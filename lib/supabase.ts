import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          metadata: any
          is_archived: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
          metadata?: any
          is_archived?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          metadata?: any
          is_archived?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: "user" | "assistant" | "system"
          content: string
          created_at: string
          metadata: any
          tokens_used: number
          response_time_ms: number
        }
        Insert: {
          id?: string
          conversation_id: string
          role: "user" | "assistant" | "system"
          content: string
          created_at?: string
          metadata?: any
          tokens_used?: number
          response_time_ms?: number
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: "user" | "assistant" | "system"
          content?: string
          created_at?: string
          metadata?: any
          tokens_used?: number
          response_time_ms?: number
        }
      }
      medical_protocols: {
        Row: {
          id: string
          title: string
          category: string
          keywords: string[]
          content: string
          source: string
          language: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          category: string
          keywords: string[]
          content: string
          source?: string
          language?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          category?: string
          keywords?: string[]
          content?: string
          source?: string
          language?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          preferred_language: string
          medical_conditions: string[] | null
          emergency_contact: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string
          medical_conditions?: string[] | null
          emergency_contact?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string
          medical_conditions?: string[] | null
          emergency_contact?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usage_stats: {
        Row: {
          id: string
          user_id: string | null
          action_type: string
          details: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action_type: string
          details?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action_type?: string
          details?: any
          created_at?: string
        }
      }
      feedbacks: {
        Row: {
          id: string
          user_id: string | null
          message_id: string | null
          rating: number | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          message_id?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          message_id?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}
