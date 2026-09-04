'use client'

import React from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { DataProvider } from '@/lib/data-context'
import { MotionConfig } from 'framer-motion'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </DataProvider>
    </AuthProvider>
  )
}
