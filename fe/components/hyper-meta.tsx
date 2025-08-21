import Link from 'next/link'

export default function AddToMetamask() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Add Hyperion to MetaMask</h2>
      <Link href="https://docs.metis.io/hyperion" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg px-8 py-3 text-lg duration-200 transition-all hover:shadow-xl">Add Now</Link>
    </div>
  )
}
