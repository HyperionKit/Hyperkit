'use client';

import { HyperkitProvider } from "hyperionkit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HyperkitProvider>
      {children}
    </HyperkitProvider>
  );
}
