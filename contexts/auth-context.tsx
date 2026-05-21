"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
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
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function withTimeout<T>(operation: PromiseLike<T>, label: string, timeoutMs = 8000) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs)
  })

  return Promise.race([Promise.resolve(operation), timeout]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })
}

function getProfileFallback(authUser: AuthUser): Profile {
  const metadata = authUser.user_metadata ?? {}
  const metadataRole = metadata.role === "her" ? "her" : "him"
  const now = new Date().toISOString()

  return {
    id: authUser.id,
    name: typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name
      : authUser.email?.split("@")[0] ?? "Usuario",
    role: metadataRole,
    avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined,
    created_at: now,
    updated_at: now,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleAuthUser = useCallback(async (authUser: AuthUser) => {
    const fallbackProfile = getProfileFallback(authUser)

    try {
      const { data: profileData, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle(),
        "Profile lookup",
      )

      if (error) {
        throw error
      }

      let resolvedProfile = profileData as Profile | null

      if (!resolvedProfile) {
        const { data: insertedProfile, error: insertError } = await withTimeout(
          supabase
            .from('profiles')
            .upsert(fallbackProfile)
            .select('*')
            .single(),
          "Profile upsert",
        )

        if (insertError) {
          throw insertError
        }

        resolvedProfile = insertedProfile as Profile
      }

      setProfile(resolvedProfile)
      setUser({
        id: resolvedProfile.id,
        name: resolvedProfile.name,
        role: resolvedProfile.role,
        avatar: resolvedProfile.avatar_url,
      })
    } catch (error) {
      console.error('Error handling auth user:', error)
      setProfile(fallbackProfile)
      setUser({
        id: fallbackProfile.id,
        name: fallbackProfile.name,
        role: fallbackProfile.role,
        avatar: fallbackProfile.avatar_url,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const clearAuth = () => {
      if (!isMounted) return

      setUser(null)
      setProfile(null)
      setIsLoading(false)
    }

    const hydrateAuthUser = (authUser: AuthUser) => {
      setTimeout(() => {
        if (isMounted) {
          void handleAuthUser(authUser)
        }
      }, 0)
    }

    withTimeout(supabase.auth.getSession(), "Supabase session").then(({ data: { session } }) => {
      if (!isMounted) return

      if (session?.user) {
        hydrateAuthUser(session.user)
      } else {
        clearAuth()
      }
    }).catch((error) => {
      console.error('Error getting session:', error)
      clearAuth()
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        clearAuth()
        return
      }

      hydrateAuthUser(session.user)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [handleAuthUser])

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
