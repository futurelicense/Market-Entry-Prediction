import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { CheckCircleIcon, XCircleIcon, LoaderIcon } from 'lucide-react';
interface TestResult {
  name: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data: any;
}
export function ApiTester() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const runTests = async () => {
    setTesting(true);
    setResults([]);
    // Test News API
    try {
      setResults(prev => [...prev, {
        name: 'News API',
        status: 'loading',
        message: 'Testing...',
        data: null
      }]);
      const newsData = await ApiService.fetchMarketNews(['us']);
      if (!newsData || newsData.length === 0) throw new Error('No news data received');
      setResults(prev => prev.map(r => r.name === 'News API' ? {
        name: 'News API',
        status: 'success',
        message: `Received ${newsData.length} news items`,
        data: newsData
      } : r));
    } catch (error) {
      setResults(prev => prev.map(r => r.name === 'News API' ? {
        name: 'News API',
        status: 'error',
        message: error.message,
        data: null
      } : r));
    }
    // Test Economic Data API
    try {
      setResults(prev => [...prev, {
        name: 'FRED API',
        status: 'loading',
        message: 'Testing...',
        data: null
      }]);
      const economicData = await ApiService.fetchEconomicData();
      if (!economicData || economicData.length === 0) throw new Error('No economic data received');
      setResults(prev => prev.map(r => r.name === 'FRED API' ? {
        name: 'FRED API',
        status: 'success',
        message: `Received ${economicData.length} indicators`,
        data: economicData
      } : r));
    } catch (error) {
      setResults(prev => prev.map(r => r.name === 'FRED API' ? {
        name: 'FRED API',
        status: 'error',
        message: error.message,
        data: null
      } : r));
    }
    // Test Market Data API
    try {
      setResults(prev => [...prev, {
        name: 'TwelveData API',
        status: 'loading',
        message: 'Testing...',
        data: null
      }]);
      const marketData = await ApiService.fetchMarketData();
      if (!marketData || marketData.length === 0) throw new Error('No market data received');
      setResults(prev => prev.map(r => r.name === 'TwelveData API' ? {
        name: 'TwelveData API',
        status: 'success',
        message: `Received ${marketData.length} market symbols`,
        data: marketData
      } : r));
    } catch (error) {
      setResults(prev => prev.map(r => r.name === 'TwelveData API' ? {
        name: 'TwelveData API',
        status: 'error',
        message: error.message,
        data: null
      } : r));
    }
    // Test Currency API
    try {
      setResults(prev => [...prev, {
        name: 'Fixer API',
        status: 'loading',
        message: 'Testing...',
        data: null
      }]);
      const currencyData = await ApiService.fetchCurrencyRates();
      if (!currencyData || Object.keys(currencyData).length === 0) throw new Error('No currency data received');
      setResults(prev => prev.map(r => r.name === 'Fixer API' ? {
        name: 'Fixer API',
        status: 'success',
        message: `Received ${Object.keys(currencyData).length} currency rates`,
        data: currencyData
      } : r));
    } catch (error) {
      setResults(prev => prev.map(r => r.name === 'Fixer API' ? {
        name: 'Fixer API',
        status: 'error',
        message: error.message,
        data: null
      } : r));
    }
    setTesting(false);
  };
  return <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">API Tester</h2>
        <button onClick={runTests} disabled={testing} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-500 text-white rounded-lg flex items-center space-x-2">
          {testing && <LoaderIcon className="w-4 h-4 animate-spin" />}
          <span>{testing ? 'Testing...' : 'Run Tests'}</span>
        </button>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {result.status === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-400" />}
                {result.status === 'error' && <XCircleIcon className="w-5 h-5 text-red-400" />}
                {result.status === 'loading' && <LoaderIcon className="w-5 h-5 text-yellow-400 animate-spin" />}
                <span className="font-medium text-white">{result.name}</span>
              </div>
              <span className={`text-sm ${result.status === 'success' ? 'text-green-400' : result.status === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                {result.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{result.message}</p>
            {result.data && <pre className="text-xs bg-slate-900 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>}
          </div>)}
      </div>
      {results.length > 0 && <div className="mt-4 text-sm text-gray-400">
          Note: If using fallback data, the API might be rate-limited or require
          CORS proxy access. Visit https://cors-anywhere.herokuapp.com/corsdemo
          to request temporary access.
        </div>}
    </div>;
}