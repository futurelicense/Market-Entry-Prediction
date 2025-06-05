import React, { useEffect, useState } from 'react';
import { BrainIcon, TrendingUpIcon, RefreshCwIcon } from 'lucide-react';
import { ApiService } from '../services/apiService';
interface PredictionScoreProps {
  isDarkMode: boolean;
}
export function PredictionScore({
  isDarkMode
}: PredictionScoreProps) {
  const [score, setScore] = useState(87);
  const [confidence, setConfidence] = useState(94);
  const [factors, setFactors] = useState([{
    factor: 'Market Demand',
    score: 92
  }, {
    factor: 'Economic Stability',
    score: 85
  }, {
    factor: 'Regulatory Environment',
    score: 78
  }]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const updatePrediction = async () => {
    setLoading(true);
    try {
      const [economicData, marketData, currencyRates] = await Promise.all([ApiService.fetchEconomicData(), ApiService.fetchMarketData(), ApiService.fetchCurrencyRates()]);
      // Calculate AI prediction based on real data
      let newScore = 75; // Base score
      // Economic factors
      const gdp = economicData.find(d => d.id === 'GDP');
      const inflation = economicData.find(d => d.id === 'INFLATION');
      const unemployment = economicData.find(d => d.id === 'UNEMPLOYMENT');
      if (gdp && gdp.change > 0) newScore += 8;
      if (inflation && inflation.value < 4) newScore += 6;
      if (unemployment && unemployment.value < 5) newScore += 5;
      // Market performance
      const avgMarketChange = marketData.reduce((acc, stock) => acc + stock.change, 0) / marketData.length;
      if (avgMarketChange > 0) newScore += Math.min(avgMarketChange * 2, 10);
      // Currency stability (lower volatility = higher score)
      const eurRate = currencyRates.EUR || 0.85;
      if (eurRate > 0.8 && eurRate < 0.9) newScore += 3;
      newScore = Math.min(Math.max(newScore, 45), 95);
      setScore(Math.round(newScore));
      // Calculate confidence based on data quality
      const dataQuality = economicData.length / 4 * 100; // We expect 4 indicators
      setConfidence(Math.min(Math.max(dataQuality * 0.9 + 10, 75), 98));
      // Update factors with real data
      setFactors([{
        factor: 'Market Demand',
        score: Math.round(85 + (avgMarketChange > 0 ? avgMarketChange * 3 : 0))
      }, {
        factor: 'Economic Stability',
        score: Math.round(80 + (gdp?.change || 0) * 10 + (inflation && inflation.value < 3 ? 10 : 0))
      }, {
        factor: 'Regulatory Environment',
        score: Math.round(75 + (unemployment && unemployment.value < 4 ? 8 : 0))
      }]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to update prediction:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    updatePrediction();
    // Update prediction every 3 minutes
    const interval = setInterval(updatePrediction, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Prediction Score
          </h3>
          <div className="flex items-center space-x-2 px-2 py-1 bg-purple-500/20 rounded-lg">
            <BrainIcon className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400 text-xs font-medium">AI</span>
          </div>
        </div>
        <button onClick={updatePrediction} disabled={loading} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          <RefreshCwIcon className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {/* Last Updated */}
      <div className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Last analysis: {lastUpdated.toLocaleTimeString()}
      </div>
      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" stroke={isDarkMode ? '#374151' : '#e5e7eb'} strokeWidth="8" fill="transparent" />
            <circle cx="60" cy="60" r="50" stroke="url(#gradient)" strokeWidth="8" fill="transparent" strokeDasharray={`${score * 3.14} 314`} strokeLinecap="round" className="transition-all duration-1000" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${loading ? 'animate-pulse' : ''}`}>
                {loading ? '...' : `${score}%`}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confidence Level */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI Confidence Level
          </span>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {loading ? '...' : `${confidence}%`}
          </span>
        </div>
        <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{
          width: `${confidence}%`
        }} />
        </div>
      </div>
      {/* Key Factors */}
      <div className="mt-6 space-y-3">
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Real-Time Success Factors
        </h4>
        <div className="space-y-2">
          {factors.map((item, index) => <div key={index} className="flex items-center justify-between">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.factor}
              </span>
              <div className="flex items-center space-x-2">
                <div className={`w-16 h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full transition-all duration-1000" style={{
                width: `${Math.min(item.score, 100)}%`
              }} />
                </div>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? '...' : `${Math.min(item.score, 100)}%`}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}