"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

const SquareCheckBig = dynamic(() => import("lucide-react").then(mod => mod.SquareCheckBig), {
  ssr: false,
})

export default function HyperkitRewards() {
  const benefits = [
    "Receive priority access to future Hyperion network events",
    "Badge holders get marketing recognition",
    "Receive badges based on your objective and verifiable accomplishments",
    'Get Exclusive opportunities in role "HyperContributor", "HyperCoder", "HyperDeveloper" our tiered badge system',
  ]

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="flex justify-center py-18 items-center p-4">
      <div className="w-full max-w-6xl rounded-2xl border border-purple-100 shadow-lg shadow-purple-50 ring-1 ring-purple-100 bg-white">
        <div className="text-center px-6 py-8 md:px-10 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
            Hyperkit: How Earn Recognition & Rewards
          </h1>
          <p className="text-base md:text-lg text-gray-500">
            Earn NFTs, tokens, and exclusive access through our point-based contribution system
          </p>
        </div>
        <div className="grid gap-4 px-6 pb-8 md:px-10 md:pb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 border border-purple-100 shadow-sm shadow-purple-50 ring-1 ring-purple-100 bg-white"
            >
              {isClient && <SquareCheckBig className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />}
              <p className="text-gray-500 text-base">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
