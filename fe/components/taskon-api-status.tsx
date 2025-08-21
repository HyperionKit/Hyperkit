'use client';

import React, { useState, useEffect } from 'react';

interface ApiStatus {
  endpoint: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  response?: any;
  error?: string;
}

export default function TaskOnApiStatus() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { endpoint: '/api/taskon/verify', status: 'idle' },
    { endpoint: '/api/taskon/verify-enhanced', status: 'idle' }
  ]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  const testEndpoint = async (endpoint: string, index: number) => {
    setApiStatuses(prev => prev.map((status, i) => 
      i === index ? { ...status, status: 'testing' } : status
    ));

    try {
      // Test with sample data
      const testData = {
        userId: 'test-user',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        taskType: 'buy',
        taskId: 'buy-tokens'
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();

      setApiStatuses(prev => prev.map((status, i) => 
        i === index ? { 
          ...status, 
          status: 'success', 
          response: result 
        } : status
      ));
    } catch (error) {
      setApiStatuses(prev => prev.map((status, i) => 
        i === index ? { 
          ...status, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        } : status
      ));
    }
  };

  const testAllEndpoints = async () => {
    setIsTestingAll(true);
    for (let i = 0; i < apiStatuses.length; i++) {
      await testEndpoint(apiStatuses[i].endpoint, i);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsTestingAll(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'testing':
        return '⏳';
      default:
        return '⏸️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'testing':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">TaskOn API Status</h3>
        <button
          onClick={testAllEndpoints}
          disabled={isTestingAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTestingAll ? 'Testing...' : 'Test All APIs'}
        </button>
      </div>

      <div className="space-y-4">
        {apiStatuses.map((apiStatus, index) => (
          <div key={apiStatus.endpoint} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(apiStatus.status)}</span>
                <span className={`font-medium ${getStatusColor(apiStatus.status)}`}>
                  {apiStatus.endpoint}
                </span>
              </div>
              <button
                onClick={() => testEndpoint(apiStatus.endpoint, index)}
                disabled={apiStatus.status === 'testing'}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {apiStatus.status === 'testing' ? 'Testing...' : 'Test'}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${getStatusColor(apiStatus.status)}`}>
                {apiStatus.status.charAt(0).toUpperCase() + apiStatus.status.slice(1)}
              </span>
            </div>

            {apiStatus.response && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Response:</h4>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(apiStatus.response, null, 2)}
                </pre>
              </div>
            )}

            {apiStatus.error && (
              <div className="mt-3 p-3 bg-red-50 rounded border">
                <h4 className="font-medium text-red-900 mb-2">Error:</h4>
                <p className="text-sm text-red-700">{apiStatus.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* API Documentation Links */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">API Documentation</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Production Endpoints:</h5>
            <div className="space-y-1 text-gray-600">
              <p>• <code className="bg-gray-100 px-1 rounded">https://hyperionkit.xyz/api/taskon/verify</code></p>
              <p>• <code className="bg-gray-100 px-1 rounded">https://hyperionkit.xyz/api/taskon/verify-enhanced</code></p>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Development Endpoints:</h5>
            <div className="space-y-1 text-gray-600">
              <p>• <code className="bg-gray-100 px-1 rounded">http://localhost:3000/api/taskon/verify</code></p>
              <p>• <code className="bg-gray-100 px-1 rounded">http://localhost:3000/api/taskon/verify-enhanced</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
