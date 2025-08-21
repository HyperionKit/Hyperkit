"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function DocsHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container flex h-16 items-center max-w-6xl mx-auto px-4">
        <Link href="#" className="mr-8 flex items-center space-x-2">
          <span className="font-bold text-xl">Hyperkit</span>
        </Link>
        <nav className="flex items-center space-x-8">
          <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Get Started
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Metis Chain
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Hyperkit
          </Link>
        </nav>
      </div>
    </header>
  )
}