'use client';

import React from 'react';
import TaskOnVerificationDemo from '@/components/taskon-verification-demo';
import TaskOnDashboard from '@/components/taskon-dashboard';
import TaskOnApiStatus from '@/components/taskon-api-status';
import { TASKON_TASKS, TASKON_CAMPAIGNS } from '@/lib/taskon-config';

export default function TaskOnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              HyperKit TaskOn Integration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete tasks, earn points, and unlock exclusive HyperKit badges. 
              Build DeFi, bridge chains, and thrive in the Hyperion ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {TASKON_CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{campaign.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Reward Pool:</span>
                  <p className="font-semibold text-green-600">{campaign.totalRewardPool.toLocaleString()} pts</p>
                </div>
                <div>
                  <span className="text-gray-500">Participants:</span>
                  <p className="font-semibold text-blue-600">{campaign.participants}</p>
                </div>
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <p className="font-semibold">{new Date(campaign.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="font-semibold">{new Date(campaign.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Task Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tasks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TASKON_TASKS.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{task.name}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {task.points} pts
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Max completions: {task.maxCompletions}x</p>
                  <p>Total possible: {task.totalPoints} pts</p>
                  {task.requirements.minAmount && (
                    <p>Min amount: {task.requirements.minAmount}</p>
                  )}
                </div>
                {task.rewards && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-1">Rewards:</p>
                    <div className="flex flex-wrap gap-1">
                      {task.rewards.tokens?.map((token) => (
                        <span key={token} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {token}
                        </span>
                      ))}
                      {task.rewards.specialAccess?.map((access) => (
                        <span key={access} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          {access}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Badge System */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">HyperKit Badge System</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HyperContributor</h3>
              <p className="text-sm text-gray-600 mb-3">Entry-level contributors who complete basic tasks</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Basic token allocations</li>
                <li>• Community access</li>
                <li>• Testing participation</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HyperCoder</h3>
              <p className="text-sm text-gray-600 mb-3">Active developers with significant contributions</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Enhanced token allocations</li>
                <li>• Beta access</li>
                <li>• Priority support</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥇</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HyperDeveloper</h3>
              <p className="text-sm text-gray-600 mb-3">Elite developers with maximum engagement</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Maximum token allocations</li>
                <li>• Governance rights</li>
                <li>• Direct collaboration</li>
                <li>• Exclusive opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* User Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your TaskOn Dashboard</h2>
          <TaskOnDashboard />
        </div>
      </div>

      {/* Task Verification Demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TaskOnVerificationDemo />
      </div>

      {/* API Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TaskOnApiStatus />
      </div>
    </div>
  );
}
