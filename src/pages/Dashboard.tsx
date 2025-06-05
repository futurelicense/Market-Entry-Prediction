import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainIcon, TrendingUpIcon, AlertTriangleIcon, GlobeIcon, BarChart3Icon, SettingsIcon } from 'lucide-react';
import { PredictionScore } from '../components/PredictionScore';
import { MarketHeatmap } from '../components/MarketHeatmap';
import { RiskRadar } from '../components/RiskRadar';
import { NewsInsights } from '../components/NewsInsights';
import { RecommendationCards } from '../components/RecommendationCards';
import { MetricsGrid } from '../components/MetricsGrid';
import { ApiTester } from '../components/ApiTester';
export function Dashboard() {
  const navigate = useNavigate();
  const [startupData, setStartupData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    const data = localStorage.getItem('startupData');
    if (!data) {
      navigate('/onboarding');
      return;
    }
    setStartupData(JSON.parse(data));
  }, [navigate]);
  if (!startupData) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BrainIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
          <p className="text-white">Loading your market intelligence...</p>
        </div>
      </div>;
  }
  return <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BrainIcon className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Market Entry Predictor
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {startupData.companyName} • {startupData.industry}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                <SettingsIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">
                  Live Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* API Tester */}
      <div className="mb-8">
        <ApiTester />
      </div>
      {/* Main Dashboard */}
      <div className="p-6">
        {/* Top Metrics */}
        <div className="mb-8">
          <MetricsGrid isDarkMode={isDarkMode} />
        </div>
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Prediction Score - Takes up 1 column */}
          <div className="lg:col-span-1">
            <PredictionScore isDarkMode={isDarkMode} />
          </div>
          {/* Market Heatmap - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <MarketHeatmap isDarkMode={isDarkMode} />
          </div>
        </div>
        {/* Second Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <RiskRadar isDarkMode={isDarkMode} />
          <NewsInsights isDarkMode={isDarkMode} />
        </div>
        {/* Recommendations */}
        <RecommendationCards isDarkMode={isDarkMode} />
      </div>
    </div>;
}