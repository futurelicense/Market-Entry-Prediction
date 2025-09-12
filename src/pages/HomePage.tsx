import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUpIcon, BrainIcon, GlobeIcon, ZapIcon } from 'lucide-react';
export function HomePage() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <BrainIcon className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-bold text-white">
            Market Entry Predictor
          </span>
        </div>
        <button onClick={() => navigate('/onboarding')} className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-colors">
          Get Started
        </button>
      </nav>
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered Market Intelligence
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Leverage real-time data, machine learning, and predictive analytics
            to determine your SaaS startup's success probability in new markets
          </p>
          <button onClick={() => navigate('/onboarding')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105">
            Start Market Analysis
          </button>
        </div>
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <TrendingUpIcon className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">
              Real-Time Analytics
            </h3>
            <p className="text-gray-300">
              Live market data from multiple APIs including economic indicators,
              news sentiment, and competitor analysis
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <BrainIcon className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">
              AI-Powered Predictions
            </h3>
            <p className="text-gray-300">
              Advanced NLP and machine learning models analyze market conditions
              to predict success probability
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <GlobeIcon className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">
              Global Market Intelligence
            </h3>
            <p className="text-gray-300">
              Comprehensive analysis across regions with regulatory insights and
              economic forecasting
            </p>
          </div>
        </div>
        {/* Stats Section */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">95%</div>
              <div className="text-gray-300">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                50+
              </div>
              <div className="text-gray-300">Markets Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">10M+</div>
              <div className="text-gray-300">Data Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                24/7
              </div>
              <div className="text-gray-300">Real-Time Updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
