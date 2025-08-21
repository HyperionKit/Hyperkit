"use client"

import { HyperkitProvider } from "hyperionkit"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HyperkitProvider>
      {children}
    </HyperkitProvider>
  )
}
