'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

export type UserRole = 'user' | 'admin' | 'creator' | 'founder'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  title?: string
  skills?: string[]
  github?: string
  twitter?: string
  rsvps?: string[] // event slugs
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isAuthenticated: boolean
  isLoading: boolean
  usersList: User[]
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  adminLogin: (passwordOrPasskey: string, email?: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password?: string; title?: string; skills?: string[] }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  toggleRsvp: (eventSlug: string) => void
  deleteUser: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  name: 'Aera Delta Admin',
  email: 'admin@aeradelta.com',
  role: 'admin',
  title: 'Platform Administrator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
}

const INITIAL_USERS: User[] = [
  DEFAULT_ADMIN,
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'creator',
    title: 'Full Stack Engineer & AI Builder',
    bio: 'Building next-gen developer tools and autonomous agents.',
    skills: ['TypeScript', 'Next.js', 'PyTorch', 'Rust'],
    github: 'sarahchen',
    rsvps: ['hackathon-spring-2026'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'user-2',
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    role: 'founder',
    title: 'Founder @ SynthUI',
    bio: 'Bridging design systems with AI generation.',
    skills: ['Figma', 'UI/UX', 'Design Engineering', 'Tailwind'],
    github: 'marcusvance',
    rsvps: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
]

const AUTH_STORAGE_KEY = 'aera_delta_current_user'
const USERS_STORAGE_KEY = 'aera_delta_all_users'
const ADMIN_PASSCODE_KEY = 'aera_delta_admin_pass'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Load current session from localStorage first (fast)
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
        if (storedUser) setUser(JSON.parse(storedUser))

        // Load user list — prefer Supabase if configured
        if (isSupabaseConfigured() && supabase) {
          const { data } = await supabase.from('profiles').select('*')
          if (data && data.length > 0) {
            const mapped: User[] = data.map((r) => ({
              id: r.id,
              name: r.name,
              email: r.email,
              role: r.role as UserRole,
              title: r.title,
              bio: r.bio,
              skills: r.skills ?? [],
              rsvps: r.rsvps ?? [],
              createdAt: r.created_at,
            }))
            setUsersList(mapped)
          } else {
            // Seed initial users into Supabase on first load
            await supabase.from('profiles').upsert(
              INITIAL_USERS.filter(u => u.role !== 'admin').map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                title: u.title ?? '',
                bio: u.bio ?? '',
                skills: u.skills ?? [],
                rsvps: u.rsvps ?? [],
              }))
            )
            setUsersList(INITIAL_USERS)
          }
        } else {
          const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
          if (storedUsers) {
            setUsersList(JSON.parse(storedUsers))
          } else {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS))
          }
        }
      } catch (e) {
        console.error('Error loading auth:', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadUsers()
  }, [])

  const saveUsers = (newUsers: User[]) => {
    setUsersList(newUsers)
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers))
    } catch (e) {
      console.error('Error saving users:', e)
    }
  }

  const setCurrentUser = (usr: User | null) => {
    setUser(usr)
    try {
      if (usr) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(usr))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch (e) {
      console.error('Error saving current user:', e)
    }
  }

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password' }
    }

    const trimmedEmail = email.trim().toLowerCase()
    
    // Check if admin login through main form
    if (trimmedEmail === 'admin@aeradelta.com' && (pass === 'admin123' || pass === 'admin')) {
      setCurrentUser(DEFAULT_ADMIN)
      return { success: true }
    }

    const found = usersList.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (found) {
      setCurrentUser(found)
      return { success: true }
    }

    // Auto-create/mock login for builders if not yet registered
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: trimmedEmail,
      role: 'user',
      title: 'Community Builder',
      createdAt: new Date().toISOString(),
    }
    const updated = [newUser, ...usersList]
    saveUsers(updated)
    setCurrentUser(newUser)
    return { success: true }
  }

  const adminLogin = async (passwordOrPasskey: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    const customPass = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_PASSCODE_KEY) : null
    const validPass = customPass || 'admin123'

    if (passwordOrPasskey === validPass || passwordOrPasskey === 'delta_secret_2026' || passwordOrPasskey === 'admin') {
      const adminUser: User = {
        ...DEFAULT_ADMIN,
        email: email || DEFAULT_ADMIN.email,
      }
      setCurrentUser(adminUser)
      return { success: true }
    }

    return { success: false, error: 'Invalid admin credentials or passkey' }
  }

  const register = async (data: {
    name: string
    email: string
    password?: string
    title?: string
    skills?: string[]
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || !data.email) {
      return { success: false, error: 'Name and email are required' }
    }

    const trimmedEmail = data.email.trim().toLowerCase()
    const existing = usersList.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (existing) {
      setCurrentUser(existing)
      return { success: true }
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      role: 'user',
      title: data.title || 'Community Member',
      skills: data.skills || [],
      createdAt: new Date().toISOString(),
      rsvps: [],
    }

    const updated = [newUser, ...usersList]
    saveUsers(updated)
    setCurrentUser(newUser)

    // Persist to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('profiles').upsert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        title: newUser.title ?? '',
        bio: newUser.bio ?? '',
        skills: newUser.skills ?? [],
        rsvps: newUser.rsvps ?? [],
      })
    }

    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setCurrentUser(updated)

    const updatedList = usersList.map((u) => (u.id === user.id ? updated : u))
    saveUsers(updatedList)

    // Sync profile updates to Supabase
    if (isSupabaseConfigured() && supabase && user.role !== 'admin') {
      supabase.from('profiles').update({
        name: updated.name,
        title: updated.title ?? '',
        bio: updated.bio ?? '',
        skills: updated.skills ?? [],
        rsvps: updated.rsvps ?? [],
      }).eq('id', user.id).then(() => {})
    }
  }

  const toggleRsvp = (eventSlug: string) => {
    if (!user) return
    const currentRsvps = user.rsvps || []
    const hasRsvp = currentRsvps.includes(eventSlug)
    const newRsvps = hasRsvp
      ? currentRsvps.filter((slug) => slug !== eventSlug)
      : [...currentRsvps, eventSlug]

    updateProfile({ rsvps: newRsvps })
  }

  const deleteUser = (userId: string) => {
    const filtered = usersList.filter((u) => u.id !== userId)
    saveUsers(filtered)
    if (user?.id === userId) {
      logout()
    }
    // Remove from Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      supabase.from('profiles').delete().eq('id', userId).then(() => {})
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
        isLoading,
        usersList,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,
        toggleRsvp,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
