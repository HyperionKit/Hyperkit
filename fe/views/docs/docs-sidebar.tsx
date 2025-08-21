"use client"

import Link from "next/link"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { ChevronRight, LifeBuoy, Play } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function DocsSidebar() {
  return (
    <div className="h-full py-8 pr-8 overflow-y-auto">
      <div className="space-y-6 px-4 md:px-0">
        {/* Quick Links */}
        <div className="space-y-2">
          <Link
            href="#"
            className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900"
          >
            <GitHubLogoIcon className="mr-3 h-4 w-4" />
            GitHub
          </Link>
          <Link
            href="#"
            className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900"
          >
            <Play className="mr-3 h-4 w-4" />
            Playground
          </Link>
          <Link
            href="#"
            className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900"
          >
            <LifeBuoy className="mr-3 h-4 w-4" />
            Support
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-violet-200 hover:text-gray-900 [&[data-state=open]>svg]:rotate-90">
              Introduction
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4 mt-2">
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md hover:bg-violet-200 text-gray-900"
              >
                Getting Started
              </Link>
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Telemetry
              </Link>
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Troubleshooting
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-violet-200 hover:text-gray-900 [&[data-state=open]>svg]:rotate-90">
              Installation
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4 mt-2">
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Next.js Installation
              </Link>
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Vite Installation
              </Link>
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Remix Installation
              </Link>
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Astro Installation
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-violet-200 hover:text-gray-900 [&[data-state=open]>svg]:rotate-90">
              Config
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4 mt-2">
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                {"<OnchainKitProvider />"}
              </Link>
              <Link
                href="#"
                className="flex items-center h-9 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900 text-gray-600"
              >
                Supplemental Providers
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-violet-200 hover:text-gray-900"
          >
            Guides
          </Link>
        </div>
      </div>
    </div>
  )
}