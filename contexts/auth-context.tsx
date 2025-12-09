"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User as AuthUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"

interface User {
  id: string
  name: string
  role: "him" | "her"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleAuthUser(session.user)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        handleAuthUser(session.user)
      } else {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthUser = async (authUser: AuthUser) => {
    try {
      // Get user profile from database
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setIsLoading(false)
        return
      }

      if (profileData) {
        setProfile(profileData)
        setUser({
          id: profileData.id,
          name: profileData.name,
          role: profileData.role,
          avatar: profileData.avatar_url,
        })
      }
    } catch (error) {
      console.error('Error handling auth user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        setIsLoading(false)
        return false
      }

      if (data.user) {
        await handleAuthUser(data.user)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return <AuthContext.Provider value={{ user, profile, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
