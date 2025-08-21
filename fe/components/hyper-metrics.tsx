"use client";
import Image from "next/image"

export default function Component() {
  const metrics = [
    { value: "< $0.001", description: "Gas fee" },
    { value: "1-2", description: "Gigagas/sec" },
    { value: "10x", description: "State sync time faster" },
    { value: "50%", description: "Storage state reduced" },
    { value: "100%", description: "Tailored for AI transactions" },
    { value: "200+", description: "Entity state updates/sec" },
  ]

  return (
    <div className="flex min-h-[600px] w-full items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 rounded-xl border border-violet-300/50 bg-white p-6 shadow-md/50 shadow-violet-500 md:grid-cols-2 md:p-10 lg:p-16">
        <div className="flex flex-col justify-center space-y-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
                                    className={`grid grid-cols-[150px_1fr] items-center gap-4 pb-4 ${
                        index < metrics.length - 1 ? "border-b border-gray-200" : ""
                      }`}
            >
              <div className="text-3xl font-medium text-gray-900 md:text-2xl lg:text-2xl">{metric.value}</div>
              <div className="text-lg text-gray-700 md:text-lg lg:text-lg">{metric.description}</div>
            </div>
          ))}
          <p className="mt-4 text-sm text-gray-500">
            {"Metrics are written in comparison with the other mainstream blockchain frameworks."}
          </p>
        </div>

        {/* Right Column: Image Placeholder */}
        <div className="flex items-center justify-center">
          <Image
            src="/right face.svg"
            alt="Illustration of server infrastructure and data processing"
            width={600}
            height={400}
            className="h-auto w-full max-w-md object-contain md:max-w-full"
          />
        </div>
      </div>
    </div>
  )
}
