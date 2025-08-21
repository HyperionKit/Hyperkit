"use client"

import { ChatPanel } from '@/components/chat-panel';
import { PreviewPanel } from '@/components/preview';
import { ModelSelector } from '@/components/model-selector';
import { ErrorBoundary } from '@/components/error';

export default function HyperionAI() {
  return (
    <div className="bg-black text-white min-h-screen">
      <ErrorBoundary />
      
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                HyperionKit AI
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Docs
                </button>
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Examples
                </button>
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)]">
        <div className="flex h-full">
          {/* Left Panel - Chat */}
          <div className="w-1/2 border-r border-gray-800">
            <ChatPanel />
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2">
            <PreviewPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
