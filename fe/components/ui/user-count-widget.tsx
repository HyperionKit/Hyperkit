"use client";
import React, { useEffect, useState } from "react";

interface UserCountWidgetProps {
  title?: string;
  description?: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserCountWidget({
  title = "Onboarded Users",
  description = "Total users who have joined the Hyperion ecosystem",
  className = "",
  showIcon = true,
  size = 'md'
}: UserCountWidgetProps) {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/users/onboarded-count');
        if (!response.ok) {
          throw new Error('Failed to fetch user count');
        }
        const data = await response.json();
        setUserCount(data.count);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
        setError('Failed to load user count');
        setUserCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const textSizes = {
    sm: { title: 'text-sm', description: 'text-xs', count: 'text-xl' },
    md: { title: 'text-lg', description: 'text-sm', count: 'text-3xl' },
    lg: { title: 'text-xl', description: 'text-base', count: 'text-4xl' }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {showIcon && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold text-gray-900 dark:text-white ${textSizes[size].title}`}>
                {title}
              </h3>
              <p className={`text-gray-500 dark:text-gray-400 ${textSizes[size].description}`}>
                {description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right ml-4">
          {isLoading ? (
            <div className="animate-pulse">
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${size === 'sm' ? 'h-8 w-16' : size === 'md' ? 'h-12 w-20' : 'h-16 w-24'}`}></div>
            </div>
          ) : error ? (
            <div className={`text-red-500 ${textSizes[size].count}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className={`font-bold text-violet-600 dark:text-violet-400 ${textSizes[size].count}`}>
              {userCount?.toLocaleString() || 'N/A'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
