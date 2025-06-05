import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ShieldIcon } from 'lucide-react';
interface RiskRadarProps {
  isDarkMode: boolean;
}
export function RiskRadar({
  isDarkMode
}: RiskRadarProps) {
  const data = [{
    subject: 'Economic',
    A: 85,
    fullMark: 100
  }, {
    subject: 'Political',
    A: 70,
    fullMark: 100
  }, {
    subject: 'Regulatory',
    A: 75,
    fullMark: 100
  }, {
    subject: 'Competition',
    A: 60,
    fullMark: 100
  }, {
    subject: 'Market Demand',
    A: 90,
    fullMark: 100
  }, {
    subject: 'Technology',
    A: 95,
    fullMark: 100
  }];
  const riskFactors = [{
    name: 'Currency Volatility',
    level: 'Low',
    color: 'text-green-400'
  }, {
    name: 'Regulatory Changes',
    level: 'Medium',
    color: 'text-yellow-400'
  }, {
    name: 'Market Saturation',
    level: 'Low',
    color: 'text-green-400'
  }, {
    name: 'Economic Downturn',
    level: 'Medium',
    color: 'text-yellow-400'
  }];
  return <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Risk Assessment
        </h3>
        <ShieldIcon className="w-5 h-5 text-cyan-400" />
      </div>
      {/* Radar Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <PolarAngleAxis dataKey="subject" tick={{
            fill: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: 12
          }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{
            fill: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: 10
          }} />
            <Radar name="Risk Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* Risk Factors */}
      <div className="space-y-4">
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Key Risk Factors
        </h4>
        <div className="space-y-3">
          {riskFactors.map((risk, index) => <div key={index} className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {risk.name}
              </span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${risk.level === 'Low' ? 'bg-green-100 text-green-800' : risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {risk.level}
              </span>
            </div>)}
        </div>
      </div>
      {/* Overall Risk Score */}
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Overall Risk Score
          </span>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-green-400">3.2</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              / 10
            </div>
          </div>
        </div>
        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Low risk - Favorable conditions for market entry
        </div>
      </div>
    </div>;
}