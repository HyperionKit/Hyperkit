"use client";

import RoadmapTimeline from "@/components/roadmap-timeline";
import FeatureGrid from "@/components/feature-grid";

export default function HyperkitRoadmap() {
  return (
    <section id="roadmap" className="text-center px-4 md:pb-4 max-w-6xl mx-auto scroll-mt-20">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-black">
        Launch DeFi, Connect Chains, Ignite Hyperion!
      </h1>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
        HyperKit empowers developers with modular DeFi tools and seamless cross-chain bridging,
        sparking innovation and community-driven growth in the Hyperion ecosystem.
      </p>
      <RoadmapTimeline/>
      <FeatureGrid/>
    </section>
  )
}
