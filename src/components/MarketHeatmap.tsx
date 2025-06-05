import React from 'react';
import { GlobeIcon, TrendingUpIcon, AlertTriangleIcon } from 'lucide-react';
interface MarketHeatmapProps {
  isDarkMode: boolean;
}
export function MarketHeatmap({
  isDarkMode
}: MarketHeatmapProps) {
  const markets = [{
    name: 'North America',
    score: 87,
    risk: 'Low',
    growth: '+12%',
    color: 'bg-green-500'
  }, {
    name: 'Europe',
    score: 82,
    risk: 'Low',
    growth: '+8%',
    color: 'bg-green-400'
  }, {
    name: 'Asia Pacific',
    score: 75,
    risk: 'Medium',
    growth: '+15%',
    color: 'bg-yellow-500'
  }, {
    name: 'Latin America',
    score: 68,
    risk: 'Medium',
    growth: '+18%',
    color: 'bg-yellow-400'
  }, {
    name: 'Middle East',
    score: 62,
    risk: 'High',
    growth: '+22%',
    color: 'bg-orange-500'
  }, {
    name: 'Africa',
    score: 45,
    risk: 'High',
    growth: '+25%',
    color: 'bg-red-500'
  }];
  return <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Global Market Opportunities
        </h3>
        <GlobeIcon className="w-5 h-5 text-cyan-400" />
      </div>
      {/* World Map Visualization */}
      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          {markets.map((market, index) => <div key={index} className={`p-3 rounded-lg border transition-all hover:scale-105 cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-600 hover:bg-slate-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${market.color}`} />
                <span className={`text-xs font-medium ${market.risk === 'Low' ? 'text-green-400' : market.risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {market.risk}
                </span>
              </div>
              <div className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {market.name}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Score: {market.score}%
                </span>
                <div className="flex items-center space-x-1">
                  <TrendingUpIcon className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">
                    {market.growth}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      {/* Market Insights */}
      <div className="space-y-4">
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Market Insights
        </h4>
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-start space-x-3">
              <TrendingUpIcon className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  North America shows highest potential
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Strong economic indicators and favorable regulations
                </div>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-start space-x-3">
              <AlertTriangleIcon className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Asia Pacific requires careful timing
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  High growth potential but regulatory complexity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}