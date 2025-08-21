'use client';

import { useAppStore } from '@/store/store';

export const ErrorBoundary = () => {
  const { error, setError } = useAppStore();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-900 border border-red-700 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-red-300 font-medium">Error</h4>
            <p className="text-red-200 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
