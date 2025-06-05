import React, { useEffect, useState } from 'react';
import { TrendingUpIcon, DollarSignIcon, UsersIcon, GlobeIcon, RefreshCwIcon } from 'lucide-react';
import { ApiService } from '../services/apiService';
interface MetricsGridProps {
  isDarkMode: boolean;
}
interface EconomicData {
  id: string;
  value: number;
  date: string;
  change: number;
}
interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}
export function MetricsGrid({
  isDarkMode
}: MetricsGridProps) {
  const [economicData, setEconomicData] = useState<EconomicData[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const fetchData = async () => {
    setLoading(true);
    try {
      const [economic, market] = await Promise.all([ApiService.fetchEconomicData(), ApiService.fetchMarketData()]);
      setEconomicData(economic);
      setMarketData(market);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    // Refresh data every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  // Calculate dynamic success probability based on real data
  const calculateSuccessProbability = () => {
    const gdpData = economicData.find(d => d.id === 'GDP');
    const inflationData = economicData.find(d => d.id === 'INFLATION');
    const marketPerformance = marketData.reduce((acc, stock) => acc + stock.change, 0) / marketData.length;
    let baseScore = 75;
    if (gdpData && gdpData.change > 0) baseScore += 5;
    if (inflationData && inflationData.value < 4) baseScore += 5;
    if (marketPerformance > 0) baseScore += 7;
    return Math.min(Math.max(baseScore, 45), 95);
  };
  // Calculate market size based on market cap data
  const calculateMarketSize = () => {
    const avgPrice = marketData.reduce((acc, stock) => acc + stock.price, 0) / marketData.length;
    const baseSize = 2.4 + avgPrice / 1000 * 0.5;
    return `$${baseSize.toFixed(1)}B`;
  };
  // Determine risk score from economic indicators
  const calculateRiskScore = () => {
    const inflationData = economicData.find(d => d.id === 'INFLATION');
    const unemploymentData = economicData.find(d => d.id === 'UNEMPLOYMENT');
    let riskScore = 3.2;
    if (inflationData && inflationData.value > 4) riskScore += 0.8;
    if (unemploymentData && unemploymentData.value > 5) riskScore += 0.5;
    return Math.min(Math.max(riskScore, 1.0), 8.0).toFixed(1);
  };
  const metrics = [{
    title: 'Success Probability',
    value: `${calculateSuccessProbability()}%`,
    change: economicData.find(d => d.id === 'GDP')?.change ? `+${(economicData.find(d => d.id === 'GDP')!.change * 4).toFixed(1)}%` : '+12%',
    trend: 'up' as const,
    icon: TrendingUpIcon,
    color: 'text-green-400'
  }, {
    title: 'Market Size',
    value: calculateMarketSize(),
    change: marketData.length > 0 ? `+${(marketData.reduce((acc, stock) => acc + stock.change, 0) / marketData.length / 2).toFixed(1)}%` : '+8%',
    trend: 'up' as const,
    icon: DollarSignIcon,
    color: 'text-blue-400'
  }, {
    title: 'Competition Level',
    value: 'Medium',
    change: 'Stable',
    trend: 'neutral' as const,
    icon: UsersIcon,
    color: 'text-yellow-400'
  }, {
    title: 'Risk Score',
    value: `${calculateRiskScore()}/10`,
    change: economicData.find(d => d.id === 'INFLATION')?.change ? `${economicData.find(d => d.id === 'INFLATION')!.change > 0 ? '+' : ''}${(economicData.find(d => d.id === 'INFLATION')!.change * 2).toFixed(1)}` : '-0.5',
    trend: economicData.find(d => d.id === 'INFLATION')?.change ? economicData.find(d => d.id === 'INFLATION')!.change > 0 ? 'up' : 'down' : 'down',
    icon: GlobeIcon,
    color: 'text-cyan-400'
  }];
  return <div>
      {/* Live Data Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">
              Real-Time Data
            </span>
          </div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        <button onClick={fetchData} disabled={loading} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          <RefreshCwIcon className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return <div key={index} className={`p-6 rounded-xl border transition-all hover:scale-105 ${loading ? 'animate-pulse' : ''} ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <div className={`flex items-center space-x-1 text-sm ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                  <span>{metric.change}</span>
                  <TrendingUpIcon className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? '...' : metric.value}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.title}
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
}