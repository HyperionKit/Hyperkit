'use client';

import { useState } from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/store';
import { ModelSelector } from '@/components/model-selector';
import { aiService } from '@/api/service';
import { MAX_PROMPT_LENGTH } from '@/constants';

export const ChatPanel = () => {
  const [prompt, setPrompt] = useState('');
  const { 
    chatMessages, 
    addChatMessage, 
    clearChat,
    setCurrentProject, 
    setIsGenerating, 
    isGenerating, 
    selectedModel,
    setError 
  } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || isGenerating) return;
    
    if (prompt.length > MAX_PROMPT_LENGTH) {
      setError(`Prompt must be ${MAX_PROMPT_LENGTH} characters or less`);
      return;
    }

    try {
      setError(null);
      setIsGenerating(true);

      // Add user message
      const userMessage = {
        id: `user_${Date.now()}`,
        content: prompt,
        role: 'user' as const,
        timestamp: new Date()
      };
      addChatMessage(userMessage);

      // Generate project
      const project = await aiService.generateProject(prompt, selectedModel);
      setCurrentProject(project);

      // Add AI response
      const aiMessage = {
        id: `ai_${Date.now()}`,
        content: `I've generated "${project.name}" based on your request. Check the preview on the right!`,
        role: 'assistant' as const,
        timestamp: new Date()
      };
      addChatMessage(aiMessage);

      setPrompt('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      const aiMessage = {
        id: `ai_error_${Date.now()}`,
        content: errorMessage,
        role: 'assistant' as const,
        timestamp: new Date()
      };
      addChatMessage(aiMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Powered by Alith AI</h2>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full">
        {chatMessages.length === 0 && (
          <div className="px-6 py-8">
            <div className="max-w-md">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Welcome to HyperionKit AI
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Transform your ideas into fully functional Web3 applications with blockchain components.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Try these prompts:</h4>
                  <div className="space-y-2">
                    <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 hover:bg-gray-800/80 transition-colors cursor-pointer group">
                      <p className="text-sm text-gray-300 group-hover:text-white">
                        "Create a DeFi dashboard with staking rewards"
                      </p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 hover:bg-gray-800/80 transition-colors cursor-pointer group">
                      <p className="text-sm text-gray-300 group-hover:text-white">
                        "Build an NFT marketplace interface"
                      </p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 hover:bg-gray-800/80 transition-colors cursor-pointer group">
                      <p className="text-sm text-gray-300 group-hover:text-white">
                        "Generate a crypto portfolio tracker"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Each project includes <span className="text-blue-400 font-medium">ConnectWallet</span>, 
                        <span className="text-blue-400 font-medium"> Swap</span>, 
                        <span className="text-blue-400 font-medium"> Bridge</span>, 
                        <span className="text-blue-400 font-medium"> Staking</span>, and 
                        <span className="text-blue-400 font-medium"> Faucet</span> components ready to use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating your project...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your Web3 project... (e.g., 'Create a DeFi staking dashboard')"
              className="w-full p-3 pr-14 bg-gray-800 border border-gray-800 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={MAX_PROMPT_LENGTH}
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="absolute bottom-3 right-3 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {prompt.length}/{MAX_PROMPT_LENGTH} characters
            </span>
            
            {/* Compact Model Selector */}
            <div className="relative">
              <ModelSelector />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
