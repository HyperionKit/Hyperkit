import { Star } from "lucide-react"
import Image from "next/image"

interface FeatureCardProps {
  title: string
  description: string
  features: string[]
}

function FeatureCard({ title, description, features }: FeatureCardProps) {
  return (
    <div className="relative flex flex-col items-center p-6 rounded-xl bg-gradient-to-b from-[#a5f3fc] to-white text-center min-w-[280px] max-w-[350px] w-full">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-t from-[#1e3a8a] to-[#93c5fd] flex items-center justify-center">
      </div>
      <h3 className="mt-28 text-2xl font-bold text-[#8b5cf6]">{title}</h3>
      <p className="mt-2 text-gray-700 text-sm px-4">{description}</p>
      <ul className="mt-6 space-y-3 text-gray-700 text-base">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center justify-center gap-2">
                <Image
                  src="/Star Icon.png"
                  alt="Hyperkit Logo"
                  width={20}
                  height={20}
                />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Component() {
  return (
    <div className="flex justify-center items-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <FeatureCard
          title="HyperContributor"
          description="Entry-level contributors who complete basic tasks"
          features={["Basic token allocations", "Community access", "Testing participation"]}
        />
        <FeatureCard
          title="HyperCoder"
          description="Active developers with significant contributions"
          features={["Enhanced token allocations", "Beta access", "Priority support"]}
        />
        <FeatureCard
          title="HyperDeveloper"
          description="Elite developers with maximum engagement"
          features={[
            "Maximum token allocations",
            "Governance rights",
            "Direct collaboration",
            "Exclusive opportunities",
          ]}
        />
      </div>
    </div>
  )
}
