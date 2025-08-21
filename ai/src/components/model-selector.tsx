'use client';

import { ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/store';
import { AI_MODELS } from '@/constants';
import { aiService } from '@/api/service';

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel, setError } = useAppStore();

  const handleModelChange = (modelId: string) => {
    try {
      aiService.switchModel(modelId);
      setSelectedModel(modelId);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to switch model');
    }
  };

  const currentModel = AI_MODELS.find(m => m.id === selectedModel);

  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(e) => handleModelChange(e.target.value)}
        className="appearance-none bg-gray-700 border border-gray-800 rounded-lg text-white text-xs px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {AI_MODELS.map((model) => (
          <option key={model.id} value={model.id} disabled={!model.available}>
            {model.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  );
};
