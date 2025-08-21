"use client";

export default function HowToEarnPoints() {
  const activities = [
    { name: "Deploy a dApp", points: "+50" },
    { name: "Bridge tokens", points: "+30" },
    { name: "Set up staking pool", points: "+20" },
    { name: "Submit feedback/PR", points: "+10" },
    { name: "Complete tutorial", points: "+5" },
    { name: "Community referral", points: "+15" },
  ]

  return (
    <div id="how-to" className="flex flex-col items-center justify-center bg-white p-4 scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#8b5cf6] mb-3">How to Earn Points</h2>
        <p className="text-gray-600 text-lg max-w-2xl">
          Complete these activities to accumulate points and unlock higher NFT tiers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-5 rounded-lg text-gray-800
                       bg-gradient-to-b from-[#8b5cf6] to-white hover:scale-105 transition-transform duration-200"
          >
            <span className="text-md font-medium">{activity.name}</span>
            <span className="text-lg font-bold text-white">{activity.points}</span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#f3e8ff] to-[#e0f7fa] p-6 rounded-lg shadow-md max-w-5xl w-full text-gray-800">
        <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
        <p className="text-sm">
          NFTs evolve as you earn more points! Higher tiers unlock governance rights, token allocations,
          and direct collaboration opportunities with our core team.
        </p>
      </div>
    </div>
  )
}
