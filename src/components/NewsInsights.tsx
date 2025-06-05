import React, { useEffect, useState } from 'react';
import { NewspaperIcon, TrendingUpIcon, AlertCircleIcon, CheckCircleIcon, RefreshCwIcon } from 'lucide-react';
import { ApiService } from '../services/apiService';
interface NewsInsightsProps {
  isDarkMode: boolean;
}
interface NewsItem {
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'High' | 'Medium' | 'Low';
  region: string;
  timestamp: string;
  url: string;
}
export function NewsInsights({
  isDarkMode
}: NewsInsightsProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await ApiService.fetchMarketNews(['us', 'gb', 'de', 'jp']);
      setNewsItems(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const sentimentSummary = {
    positive: Math.round(newsItems.filter(item => item.sentiment === 'positive').length / newsItems.length * 100) || 45,
    neutral: Math.round(newsItems.filter(item => item.sentiment === 'neutral').length / newsItems.length * 100) || 35,
    negative: Math.round(newsItems.filter(item => item.sentiment === 'negative').length / newsItems.length * 100) || 20
  };
  return <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Live Market Intelligence
          </h3>
          <div className="flex items-center space-x-2 px-2 py-1 bg-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={fetchNews} disabled={loading} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
            <RefreshCwIcon className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <NewspaperIcon className="w-5 h-5 text-cyan-400" />
        </div>
      </div>
      {/* Last Updated */}
      <div className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
      {/* Sentiment Overview */}
      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Real-Time Market Sentiment
        </h4>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Positive {sentimentSummary.positive}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Neutral {sentimentSummary.neutral}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Negative {sentimentSummary.negative}%
            </span>
          </div>
        </div>
      </div>
      {/* News Feed */}
      <div className="space-y-4">
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Latest Updates
        </h4>
        {loading ? <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className={`p-3 rounded-lg animate-pulse ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
                <div className={`h-3 rounded w-3/4 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`} />
              </div>)}
          </div> : <div className="space-y-3 max-h-64 overflow-y-auto">
            {newsItems.map((item, index) => <div key={index} className={`p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${isDarkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`} onClick={() => item.url !== '#' && window.open(item.url, '_blank')}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.sentiment === 'positive' ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : item.sentiment === 'negative' ? <AlertCircleIcon className="w-4 h-4 text-red-400" /> : <TrendingUpIcon className="w-4 h-4 text-yellow-400" />}
                    <span className={`text-xs px-2 py-1 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-800' : item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {item.impact} Impact
                    </span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.timestamp}
                  </span>
                </div>
                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </div>
                <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.summary}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {item.region}
                  </span>
                  <div className={`text-xs font-medium ${item.sentiment === 'positive' ? 'text-green-400' : item.sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}