import Link from "next/link"
import { Copy, Terminal } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function DocsContent() {
  return (
    <article className="prose max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 px-4 md:px-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 m-0">
          Getting Started
        </h1>
        <Button variant="outline" size="sm" className="gap-2 bg-white border-gray-200 self-start sm:self-center">
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy page</span>
          <span className="sm:hidden">Copy</span>
        </Button>
      </div>

      <div className="space-y-6 px-4 md:px-0">
        <div className="space-y-4">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Hyperkit is your go-to SDK for building beautiful onchain applications. Ship in minutes, not weeks.
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Anyone can build an onchain app in 15 minutes with Hyperkit. No blockchain experience required.
          </p>
        </div>

        <section className="space-y-6 pt-4">
          <h2 id="why-hyperkit" className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            Why Hyperkit?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Hyperkit streamlines app development by providing a comprehensive toolkit that combines powerful onchain
            features with developer-friendly design:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-900">Ergonomic design:</strong> Full-stack tools that make complex onchain interactions intuitive
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-900">Battle-tested patterns:</strong> Industry best practices packaged into ready-to-use solutions
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-900">Purpose-built components:</strong> Pre-built modules for common onchain workflows
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-900">Framework agnostic:</strong> Compatible with any React-supporting framework
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <strong className="text-gray-900">Supercharged by Base:</strong> Deep integration with Base's protocol features and ecosystem
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-6 pt-6">
          <h2 id="automatic-installation" className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            Automatic Installation
          </h2>
          <div className="relative rounded-lg bg-gray-900 p-4 sm:p-6 font-mono text-sm text-gray-50 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span className="text-gray-300">Terminal</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-gray-50">
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy code</span>
              </Button>
            </div>
            <pre className="overflow-x-auto pt-4">
              <code>npm create hyperkit@latest</code>
            </pre>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              After the prompts, <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">create hyperkit</code> will create a folder with your project name and install the required dependencies.
            </p>
            <p className="text-gray-700">You can also checkout our pre-built templates:</p>
            <ul className="space-y-2 ml-4">
              <li>
                <Link href="#" className="text-violet-600 hover:text-violet-800 hover:underline">Hyperkit Commerce</Link>
              </li>
              <li>
                <Link href="#" className="text-violet-600 hover:text-violet-800 hover:underline">NFT minting</Link>
              </li>
              <li>
                <Link href="#" className="text-violet-600 hover:text-violet-800 hover:underline">Funding flow</Link>
              </li>
              <li>
                <Link href="#" className="text-violet-600 hover:text-violet-800 hover:underline">Social profile</Link>
              </li>
            </ul>
          </div>

          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 shrink-0 text-green-600 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="m-0">
                These docs are LLM-friendly—reference{" "}
                <Link href="#" className="font-semibold text-green-700 underline hover:text-green-800">
                  Hyperkit AI Prompting Guide
                </Link>{" "}
                in your code editor to streamline builds and prompt smarter.
              </span>
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4 pt-6">
          <h2 id="manual-installation" className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            Manual Installation
          </h2>
          <p className="text-gray-700 leading-relaxed">Add Hyperkit to your existing project manually.</p>
        </section>

        <section className="space-y-6 pt-6">
          <h2 id="metis-protocol" className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            Metis Protocol
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Metis is an Ethereum Layer 2 scaling solution that aims to address the challenges of scalability, speed, and
            cost on the Ethereum blockchain. Built on Optimistic Rollup technology, Metis provides a highly scalable and
            low-cost environment for dApps and transactions.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Features of Metis:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Optimistic Rollup:</strong> Processes transactions off-chain and submits them to Ethereum in batches, significantly reducing gas fees and increasing throughput.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">EVM Compatibility:</strong> Fully compatible with the Ethereum Virtual Machine, allowing developers to easily migrate existing Ethereum dApps or build new ones.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Low Gas Fees & Fast Transactions:</strong> Offers significantly lower transaction costs and faster confirmation times compared to Ethereum mainnet.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Decentralized Autonomous Companies (DACs):</strong> Introduces a unique framework for building and managing DACs, enabling decentralized governance and collaboration for businesses and communities.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Storage Layer:</strong> Integrates a decentralized storage solution to handle data availability, further enhancing scalability and reducing costs.
                </div>
              </li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Metis is designed to support a wide range of applications, from DeFi and NFTs to gaming and enterprise
            solutions, making blockchain technology more accessible and efficient for mass adoption.
          </p>
        </section>

        <section className="space-y-6 pt-6">
          <h2 id="hyperion-protocol" className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            Hyperion Protocol (Hyperion Network)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Hyperion Protocol is building a decentralized spatial blockchain network that aims to revolutionize global
            mapping and location services. It leverages blockchain technology to create a secure, private, and open mapping
            ecosystem, challenging traditional centralized mapping solutions.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Features of Hyperion:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">MapChain:</strong> A decentralized mapping infrastructure that allows users to contribute, verify, and utilize spatial data.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Atlas:</strong> A decentralized map service that provides high-precision location data and navigation without relying on centralized servers.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Titan:</strong> A privacy-preserving location sharing protocol that enables users to control their location data and share it securely.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Proof-of-Location (PoL):</strong> A consensus mechanism that verifies the authenticity of location data contributed to the network, ensuring data integrity.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Decentralized Crowdsourcing:</strong> Incentivizes users to contribute mapping data, fostering a community-driven approach to global mapping.
                </div>
              </li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Hyperion's vision is to create a self-governing, decentralized spatial ecosystem where users own their data and
            can access reliable, censorship-resistant location services.
          </p>
        </section>
      </div>
    </article>
  )
}