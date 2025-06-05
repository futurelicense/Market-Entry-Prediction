import React from 'react';
import { StarIcon, ArrowRightIcon, TrendingUpIcon, ShieldCheckIcon, DollarSignIcon } from 'lucide-react';
interface RecommendationCardsProps {
  isDarkMode: boolean;
}
export function RecommendationCards({
  isDarkMode
}: RecommendationCardsProps) {
  const recommendations = [{
    rank: 1,
    market: 'North America',
    score: 87,
    timeframe: '6-9 months',
    investment: '$250K - $500K',
    reasons: ['Strong market demand for SaaS solutions', 'Favorable regulatory environment', 'High purchasing power and tech adoption'],
    risks: ['High competition', 'Market saturation in some segments'],
    icon: TrendingUpIcon,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10'
  }, {
    rank: 2,
    market: 'Europe',
    score: 82,
    timeframe: '8-12 months',
    investment: '$200K - $400K',
    reasons: ['GDPR compliance creates trust advantage', 'Growing digital transformation initiatives', 'Stable economic conditions'],
    risks: ['Complex regulatory landscape', 'Multiple languages/cultures'],
    icon: ShieldCheckIcon,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  }, {
    rank: 3,
    market: 'Asia Pacific',
    score: 75,
    timeframe: '12-18 months',
    investment: '$300K - $600K',
    reasons: ['Rapid digital adoption and growth', 'Large addressable market', 'Government support for tech innovation'],
    risks: ['Cultural adaptation required', 'Regulatory complexity'],
    icon: DollarSignIcon,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  }];
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Recommendations
        </h3>
        <div className="flex items-center space-x-2">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Top 3 Markets
          </span>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
        const Icon = rec.icon;
        return <div key={index} className={`p-6 rounded-xl border transition-all hover:scale-105 cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${rec.bgColor}`}>
                    <Icon className={`w-5 h-5 ${rec.color}`} />
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      #{rec.rank} {rec.market}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Score: {rec.score}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(rec.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                </div>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Timeframe
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {rec.timeframe}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Investment
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {rec.investment}
                  </div>
                </div>
              </div>
              {/* Reasons */}
              <div className="mb-4">
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Key Advantages
                </div>
                <ul className="space-y-1">
                  {rec.reasons.map((reason, i) => <li key={i} className={`text-xs flex items-start space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>)}
                </ul>
              </div>
              {/* Risks */}
              <div className="mb-6">
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Considerations
                </div>
                <ul className="space-y-1">
                  {rec.risks.map((risk, i) => <li key={i} className={`text-xs flex items-start space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>)}
                </ul>
              </div>
              {/* Action Button */}
              <button className={`w-full py-2 px-4 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${isDarkMode ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                <span className="text-sm font-medium">View Details</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>;
      })}
      </div>
    </div>;
}