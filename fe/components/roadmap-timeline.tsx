"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface TimelinePointProps {
  id: string
  type: "phase" | "milestone"
  title?: string
  description?: string
  markerGradient?: string
  markerColor?: string
  left: string
  lineColorClass: string
  index: number
}

const TimelinePoint: React.FC<TimelinePointProps> = ({
  type,
  title,
  description,
  markerGradient,
  markerColor,
  left,
  lineColorClass,
  index,
}) => {
  const isPhase = type === "phase"
  const markerSize = isPhase ? "w-3 h-3 md:w-4 md:h-4" : "w-2 h-2 md:w-2 md:h-2"
  const markerClasses = isPhase
    ? `relative rounded-full flex items-center justify-center bg-gradient-to-br ${markerGradient}`
    : `rounded-full ${markerColor}`

  return (
    <div
      className="absolute flex flex-col items-center px-2 md:px-2"
      style={{
        left,
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {isPhase ? (
        <>
          <div className="absolute bottom-[calc(100%+20px)] md:bottom-[calc(100%+30px)] text-center text-xs md:text-sm font-medium text-gray-700 whitespace-pre-line w-[80px] md:w-[100px]">
            {title}
          </div>
          <div className={`absolute bottom-full w-0.5 h-4 md:h-6 ${lineColorClass}`} />
          <div className={`relative z-10 ${markerClasses} ${markerSize}`}>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
          </div>
        </>
      ) : (
        <>
          <div className={`relative z-10 ${markerClasses} ${markerSize}`} />
          <div className={`absolute top-full w-0.5 h-4 md:h-6 ${lineColorClass}`} />
          <div className="absolute top-[calc(100%+20px)] md:top-[calc(100%+30px)] text-center text-xs md:text-sm text-gray-600 max-w-[75px] md:max-w-[90px] whitespace-pre-line leading-tight">
            {description}
          </div>
        </>
      )}
    </div>
  )
}

const timelineData: Omit<TimelinePointProps, "index">[] = [
  {
    id: "q3-phase1",
    type: "phase",
    title: "Q3 Phase 1:\nDeveloping Stage",
    markerGradient: "from-purple-500 to-fuchsia-500",
    lineColorClass: "bg-purple-500",
    left: "2%",
  },
  {
    id: "design-defi",
    type: "milestone",
    description: "Design Modular DeFi Primitives",
    markerColor: "bg-purple-500",
    lineColorClass: "bg-purple-500",
    left: "10.7%",
  },
  {
    id: "build-cli",
    type: "milestone",
    description: "Build Core CLI and TypeScript SDK",
    markerColor: "bg-purple-500",
    lineColorClass: "bg-purple-500",
    left: "19.4%",
  },
  {
    id: "q4-phase2",
    type: "phase",
    title: "Q4 Phase 2:\nStress Test Launch",
    markerGradient: "from-blue-500 to-indigo-500",
    lineColorClass: "bg-blue-500",
    left: "28.1%",
  },
  {
    id: "integrate-metis",
    type: "milestone",
    description: "Integrate Metis SDK for Bridging",
    markerColor: "bg-blue-500",
    lineColorClass: "bg-blue-500",
    left: "36.8%",
  },
  {
    id: "release-alpha",
    type: "milestone",
    description: "Release Alpha with Documentation",
    markerColor: "bg-blue-500",
    lineColorClass: "bg-blue-500",
    left: "45.5%",
  },
  {
    id: "develop-python",
    type: "milestone",
    description: "Develop Python SDK and Enhance CLI",
    markerColor: "bg-blue-500",
    lineColorClass: "bg-blue-500",
    left: "54.2%",
  },
  {
    id: "implement-vault",
    type: "milestone",
    description: "Implement Vault and Swapping Features",
    markerColor: "bg-blue-500",
    lineColorClass: "bg-blue-500",
    left: "62.9%",
  },
  {
    id: "deploy-beta",
    type: "milestone",
    description: "Deploy Beta Dashboard and Audits",
    markerColor: "bg-blue-500",
    lineColorClass: "bg-blue-500",
    left: "71.6%",
  },
  {
    id: "badge-rewards",
    type: "milestone",
    description: "Badge Rewards Community",
    markerColor: "bg-cyan-400",
    lineColorClass: "bg-cyan-400",
    left: "80.3%",
  },
  {
    id: "launch-hyperkit",
    type: "milestone",
    description: "Launch HyperKit v1.0.0 and Scale Ecosystem",
    markerColor: "bg-cyan-400",
    lineColorClass: "bg-cyan-400",
    left: "89%",
  },
  {
    id: "q1-phase3",
    type: "phase",
    title: "Q1 (2026) Phase 3\nOfficial Launch",
    markerGradient: "from-cyan-400 to-blue-400",
    lineColorClass: "bg-cyan-400",
    left: "98%",
  },
]

export default function Component() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[140px] md:h-[200px] flex items-center justify-center bg-white py-4 md:py-6 px-2 md:px-8">
      <div 
        className="relative h-full w-full flex items-center overflow-x-auto md:overflow-x-visible px-8 md:px-8"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div
          className="absolute top-1/2 h-0.5 left-8 md:left-8 md:right-8 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #8B5CF6 0%, #EC4899 30%, #3B82F6 60%, #06B6D4 100%)",
            width: isMobile ? "300%" : "calc(100% - 4rem)",
          }}
        />
        <div
          className="relative flex-shrink-0 md:w-full"
          style={{
            width: isMobile ? "300%" : "100%",
            minWidth: isMobile ? "300%" : "100%",
          }}
        >
          {timelineData.map((item, index) => (
            <TimelinePoint key={item.id} {...item} index={index} />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          div[style*="overflow-x"]::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </div>
  )
}