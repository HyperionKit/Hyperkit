"use client";
import Link from 'next/link'
import { Github } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroSection: React.FC = () => {
  // Prevent hydration mismatch by only rendering icons after client mount
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white text-black flex flex-col justify-center">
      {/* Hero Content */}
      <div className='px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-18 text-center'>
        <h1 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 leading-tight text-violet-600'>Hyperkit</h1>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
          Build DeFi, Bridge Chains,{' '}
          <br className="hidden sm:inline" />
          Thrive in{' '}
          <span className="bg-clip-text">
            Hyperion
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl mx-auto leading-relaxed px-2">
          Modular tools and cross-chain magic with HyperKit empowering 
          developers to create, connect, and grow in minutes.
        </p>
        
        {/* Mobile-first responsive button layout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <button 
            onClick={() => {
              navigator.clipboard.writeText("npm create hyperkit");
              // You can add a toast notification here if needed
            }}
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            npm create hyperkit
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <Link href="/" className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base">
            Whitelist
          </Link>
          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/docs" className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base">
              <span>Docs</span>
              <span>→</span>
            </Link>
            <Link href="https://github.com/HyperionKit" className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg transition-all duration-300 flex items-center justify-center">
              {/* Only render icon after client mount to prevent hydration mismatch */}
              {isMounted && <Github className="w-4 h-4 sm:w-5 sm:h-5" />}
              {/* Fallback for SSR - you could use a simple text or leave empty */}
              {!isMounted && <span className="w-4 h-4 sm:w-5 sm:h-5 inline-block" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;