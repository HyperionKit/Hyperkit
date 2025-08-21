"use client"
import Link from "next/link"

export function DocsTableOfContents() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">On this page</h3>
      <nav className="space-y-2">
        <Link href="#why-hyperkit" className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Why Hyperkit?
        </Link>
        <Link href="#automatic-installation" className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Automatic Installation
        </Link>
        <Link href="#manual-installation" className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Manual Installation
        </Link>
        <Link href="#metis-protocol" className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Metis Protocol
        </Link>
        <Link href="#hyperion-protocol" className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Hyperion Protocol
        </Link>
      </nav>
    </div>
  )
}