export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: "him" | "her"
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: "him" | "her"
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: "him" | "her"
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      romantic_memories: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          type: "photo" | "quote" | "memory" | "special-day" | "moment"
          content: string
          image_url?: string
          tags: string[]
          is_favorite: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          type: "photo" | "quote" | "memory" | "special-day" | "moment"
          content: string
          image_url?: string
          tags: string[]
          is_favorite?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          type?: "photo" | "quote" | "memory" | "special-day" | "moment"
          content?: string
          image_url?: string
          tags?: string[]
          is_favorite?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      special_days: {
        Row: {
          id: string
          title: string
          date: string
          description: string
          is_recurring: boolean
          category: "anniversary" | "first-time" | "milestone" | "celebration"
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          description: string
          is_recurring?: boolean
          category: "anniversary" | "first-time" | "milestone" | "celebration"
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          description?: string
          is_recurring?: boolean
          category?: "anniversary" | "first-time" | "milestone" | "celebration"
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          text: string
          author?: string
          date: string
          context?: string
          is_favorite: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          text: string
          author?: string
          date: string
          context?: string
          is_favorite?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          text?: string
          author?: string
          date?: string
          context?: string
          is_favorite?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      joint_finance_entries: {
        Row: {
          id: string
          title: string
          description: string | null
          amount: number
          type: "income" | "expense"
          category: string
          entry_date: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          amount: number
          type: "income" | "expense"
          category: string
          entry_date: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          amount?: number
          type?: "income" | "expense"
          category?: string
          entry_date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type RomanticMemory = Database['public']['Tables']['romantic_memories']['Row']
export type SpecialDay = Database['public']['Tables']['special_days']['Row']
export type Quote = Database['public']['Tables']['quotes']['Row']
export type FinanceEntry = Database['public']['Tables']['joint_finance_entries']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertRomanticMemory = Database['public']['Tables']['romantic_memories']['Insert']
export type InsertSpecialDay = Database['public']['Tables']['special_days']['Insert']
export type InsertQuote = Database['public']['Tables']['quotes']['Insert']
export type InsertFinanceEntry = Database['public']['Tables']['joint_finance_entries']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateRomanticMemory = Database['public']['Tables']['romantic_memories']['Update']
export type UpdateSpecialDay = Database['public']['Tables']['special_days']['Update']
export type UpdateQuote = Database['public']['Tables']['quotes']['Update']
export type UpdateFinanceEntry = Database['public']['Tables']['joint_finance_entries']['Update']

// Legacy interfaces for backward compatibility
export interface User {
  id: string
  name: string
  role: "him" | "her"
  avatar?: string
  joinedAt: Date
}
