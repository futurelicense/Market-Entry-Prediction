import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
interface StartupData {
  companyName: string;
  industry: string;
  stage: string;
  teamSize: number;
  funding: string;
  targetMarkets: string[];
  businessModel: string;
  monthlyRevenue: string;
}
export function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [startupData, setStartupData] = useState<StartupData>({
    companyName: '',
    industry: '',
    stage: '',
    teamSize: 0,
    funding: '',
    targetMarkets: [],
    businessModel: '',
    monthlyRevenue: ''
  });
  const totalSteps = 4;
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save data to localStorage and navigate to dashboard
      localStorage.setItem('startupData', JSON.stringify(startupData));
      navigate('/dashboard');
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const updateData = (field: keyof StartupData, value: any) => {
    setStartupData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const toggleMarket = (market: string) => {
    const markets = startupData.targetMarkets.includes(market) ? startupData.targetMarkets.filter(m => m !== market) : [...startupData.targetMarkets, market];
    updateData('targetMarkets', markets);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">
              Setup Your Analysis
            </h1>
            <span className="text-gray-300">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300" style={{
            width: `${currentStep / totalSteps * 100}%`
          }} />
          </div>
        </div>
        {/* Step Content */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          {currentStep === 1 && <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                Company Basics
              </h2>
              <div>
                <label className="block text-gray-300 mb-2">Company Name</label>
                <input type="text" value={startupData.companyName} onChange={e => updateData('companyName', e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none" placeholder="Enter your company name" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Industry</label>
                <select value={startupData.industry} onChange={e => updateData('industry', e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                  <option value="">Select Industry</option>
                  <option value="fintech">FinTech</option>
                  <option value="healthtech">HealthTech</option>
                  <option value="edtech">EdTech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="productivity">Productivity</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Company Stage
                </label>
                <select value={startupData.stage} onChange={e => updateData('stage', e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                  <option value="">Select Stage</option>
                  <option value="idea">Idea Stage</option>
                  <option value="mvp">MVP</option>
                  <option value="early">Early Stage</option>
                  <option value="growth">Growth Stage</option>
                  <option value="scale">Scale Stage</option>
                </select>
              </div>
            </div>}
          {currentStep === 2 && <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                Team & Funding
              </h2>
              <div>
                <label className="block text-gray-300 mb-2">Team Size</label>
                <input type="number" value={startupData.teamSize} onChange={e => updateData('teamSize', parseInt(e.target.value) || 0)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none" placeholder="Number of team members" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Funding Status
                </label>
                <select value={startupData.funding} onChange={e => updateData('funding', e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                  <option value="">Select Funding Status</option>
                  <option value="bootstrapped">Bootstrapped</option>
                  <option value="pre-seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B+</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Monthly Revenue
                </label>
                <select value={startupData.monthlyRevenue} onChange={e => updateData('monthlyRevenue', e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                  <option value="">Select Revenue Range</option>
                  <option value="0">$0 (Pre-revenue)</option>
                  <option value="1-10k">$1K - $10K</option>
                  <option value="10-50k">$10K - $50K</option>
                  <option value="50-100k">$50K - $100K</option>
                  <option value="100k+">$100K+</option>
                </select>
              </div>
            </div>}
          {currentStep === 3 && <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                Target Markets
              </h2>
              <p className="text-gray-300 mb-4">
                Select the markets you're considering for expansion:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'].map(market => <button key={market} onClick={() => toggleMarket(market)} className={`p-4 rounded-lg border-2 transition-all ${startupData.targetMarkets.includes(market) ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' : 'border-white/20 bg-black/20 text-gray-300 hover:border-white/40'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{market}</span>
                      {startupData.targetMarkets.includes(market) && <CheckIcon className="w-5 h-5" />}
                    </div>
                  </button>)}
              </div>
            </div>}
          {currentStep === 4 && <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                Business Model
              </h2>
              <div>
                <label className="block text-gray-300 mb-2">
                  Revenue Model
                </label>
                <select value={startupData.businessModel} onChange={e => updateData('businessModel', e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                  <option value="">Select Business Model</option>
                  <option value="subscription">Subscription (SaaS)</option>
                  <option value="freemium">Freemium</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="transaction">Transaction-based</option>
                  <option value="advertising">Advertising</option>
                  <option value="enterprise">Enterprise Licensing</option>
                </select>
              </div>
              <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ready to Analyze
                </h3>
                <p className="text-gray-300">
                  We'll use your information to provide personalized market
                  entry predictions and recommendations based on real-time data
                  and AI analysis.
                </p>
              </div>
            </div>}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button onClick={handleBack} disabled={currentStep === 1} className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button onClick={handleNext} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg transition-all">
              <span>
                {currentStep === totalSteps ? 'Start Analysis' : 'Next'}
              </span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}