"use client";
export default function FeatureGrid() {
  const features = [
    {
      icon: "/fullstack icon.png",
      title: "Full-Stack DeFi Toolkit",
      description:
        "Made Simple Build Without the Blockchain Hassle. Development for All No Blockchain Expertise Needed.",
    },
    {
      icon: "/AI Friendly Icon.png",
      title: "AI and DeFi Synergy",
      description: "AI Meets DeFi Power Your Apps with HyperKit's Tools.",
    },
    {
      icon: "/Serverless Icon.png",
      title: "Serverless Deployment",
      description: 'Just "npm create hyperkit" to start Deploy DeFi Serverless One Command, Instant Results.',
    },
    {
      icon: "/Composable Icon.png",
      title: "Composable Cross-Chain Ecosystem",
      description: "Build on Hyperion's Interoperable Future. upon other apps in the Metis ecosystem.",
    },
    {
      icon: "/Ship Faster Icon.png",
      title: "Ship Faster with Standard Components",
      description:
        "Faster Focus on Innovation, Not Setup. Remove complexity with standard components, so you can focus on making your app stand out.",
    },
    {
      icon: "/Cost Effective Icon.png",
      title: "Cost-Effective Transactions",
      description: "Metis offers fast and affordable transactions, where fees are Low-Cost Transactions.",
    },
  ]

  return (
    <>
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% { 
            border-color: rgb(196 181 253); 
            border-opacity: 1; 
          }
          50% { 
            border-color: rgb(139 92 246); 
            border-opacity: 0.5; 
          }
        }
        .animate-pulse {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
      <section className="w-full pt-12 bg-white">
        <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-3 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-start space-y-4 p-4 border-1 hover:border-purple-400 transition-colors duration-300 h-full rounded-lg bg-white border-gray-200"
            >
              <div className="p-3 text-purple-600">
                <img 
                  src={feature.icon} 
                  alt={`${feature.title} icon`}
                  className="w-6 h-6 object-contain"
                />
              </div>
                          <h3 className="text-xl font-bold text-purple-800 text-left">{feature.title}</h3>
            <p className="text-blue-500 leading-relaxed text-left">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}