// API Service for fetching real-time market data
import { ENV } from '../config/environment';
import { CacheService } from './CacheService';
import { RateLimiter } from './RateLimiter';
import { RetryService } from './RetryService';
export class ApiService {
  private static cache = CacheService.getInstance();
  private static rateLimiter = RateLimiter.getInstance();
  // Initialize rate limiters
  static {
    Object.entries(ENV.RATE_LIMITS).forEach(([key, config]) => {
      this.rateLimiter.initBucket(key, config.tokens, config.interval);
    });
  }
  // Fetch latest news with sentiment analysis
  static async fetchMarketNews(regions: string[] = ['us', 'gb', 'de']) {
    const cacheKey = `news_${regions.join('_')}`;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached news data');
      return cachedData;
    }
    await this.rateLimiter.tryAcquire('news');
    try {
      console.log('Fetching news for regions:', regions);
      const results = await RetryService.retry(async () => {
        const promises = regions.map(region => this.fetchNewsForRegion(region));
        const newsData = await Promise.all(promises);
        const flattenedData = newsData.flat().slice(0, 10);
        if (flattenedData.length === 0) {
          console.warn('No news data received, using fallback');
          return this.getFallbackNews();
        }
        return flattenedData;
      });
      this.cache.set(cacheKey, results, ENV.CACHE_DURATION.news);
      return results;
    } catch (error) {
      console.error('Error in fetchMarketNews:', error);
      return this.getFallbackNews();
    }
  }
  private static async fetchNewsForRegion(region: string) {
    try {
      // Remove CORS proxy temporarily for testing
      const url = new URL('https://newsdata.io/api/1/news');
      const params = {
        apikey: ENV.API_KEYS.newsData,
        country: region,
        category: 'business,technology',
        language: 'en',
        size: '5'
      };
      // Add parameters to URL
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key as keyof typeof params]));
      const response = await fetch(url.toString());
      if (!response.ok) {
        console.error('News API Response:', await response.text());
        throw new Error(`News API error: ${response.status}`);
      }
      const data = await response.json();
      // Add detailed logging
      console.log('News API Response:', {
        status: response.status,
        totalResults: data.totalResults,
        results: data.results?.length || 0
      });
      if (!data.results || !Array.isArray(data.results)) {
        console.error('Invalid news data format:', data);
        return [];
      }
      return data.results.map(this.transformNewsItem) || [];
    } catch (error) {
      console.error('News API Error:', error);
      throw new Error(`News API error: ${error.message}`);
    }
  }
  private static transformNewsItem(article: any) {
    return {
      title: article.title,
      summary: article.description || article.content?.substring(0, 150) + '...',
      sentiment: ApiService.analyzeSentiment(article.title + ' ' + (article.description || '')),
      impact: ApiService.calculateImpact(article.title),
      region: ApiService.getRegionName(article.country),
      timestamp: ApiService.formatTimestamp(article.pubDate),
      url: article.link
    };
  }
  // Fetch economic indicators from FRED
  static async fetchEconomicData() {
    try {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      const indicators = [{
        id: 'GDP',
        series: 'GDPC1'
      }, {
        id: 'INFLATION',
        series: 'CPIAUCSL'
      }, {
        id: 'UNEMPLOYMENT',
        series: 'UNRATE'
      }, {
        id: 'INTEREST_RATE',
        series: 'FEDFUNDS'
      }];
      const promises = indicators.map(async indicator => {
        const url = new URL(`${corsProxy}https://api.stlouisfed.org/fred/series/observations`);
        url.searchParams.append('series_id', indicator.series);
        url.searchParams.append('api_key', this.API_KEYS.fred);
        url.searchParams.append('file_type', 'json');
        url.searchParams.append('limit', '2');
        url.searchParams.append('sort_order', 'desc');
        url.searchParams.append('observation_start', this.getLastYearDate());
        const response = await fetch(url.toString(), {
          headers: {
            Origin: window.location.origin
          }
        });
        if (!response.ok) {
          console.warn(`FRED API warning for ${indicator.id}:`, response.status);
          return this.getFallbackIndicator(indicator.id);
        }
        const data = await response.json();
        const latest = data.observations?.[0];
        const previous = data.observations?.[1];
        return {
          id: indicator.id,
          value: parseFloat(latest?.value || '0'),
          date: latest?.date,
          change: previous ? (parseFloat(latest?.value) - parseFloat(previous?.value)) / parseFloat(previous?.value) * 100 : this.calculateChange(indicator.id)
        };
      });
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching economic data:', error);
      return this.getFallbackEconomicData();
    }
  }
  // Fetch market data from Twelve Data
  static async fetchMarketData() {
    try {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      const symbols = ['SPY', 'QQQ', 'VTI', 'ARKK'];
      const promises = symbols.map(async symbol => {
        const response = await fetch(`${corsProxy}https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${this.API_KEYS.twelveData}&source=docs`, {
          headers: {
            Origin: window.location.origin
          }
        });
        if (!response.ok) {
          console.warn(`Twelve Data API warning for ${symbol}:`, response.status);
          return this.getFallbackMarketSymbol(symbol);
        }
        const data = await response.json();
        return {
          symbol,
          price: parseFloat(data.close || '0'),
          change: parseFloat(data.percent_change || '0'),
          volume: parseInt(data.volume || '0')
        };
      });
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getFallbackMarketData();
    }
  }
  // Fetch currency exchange rates
  static async fetchCurrencyRates() {
    try {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      const response = await fetch(`${corsProxy}https://api.apilayer.com/fixer/latest?base=USD&symbols=EUR,GBP,JPY,CAD,AUD`, {
        headers: {
          apikey: this.API_KEYS.fixer,
          Origin: window.location.origin
        }
      });
      if (!response.ok) {
        console.warn('Fixer API warning:', response.status);
        return this.getFallbackCurrencyRates();
      }
      const data = await response.json();
      return data.rates || this.getFallbackCurrencyRates();
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      return this.getFallbackCurrencyRates();
    }
  }
  // Helper methods
  private static getLastYearDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  }
  private static getFallbackIndicator(id: string) {
    const fallbacks: {
      [key: string]: any;
    } = {
      GDP: {
        id: 'GDP',
        value: 2.1,
        date: '2024-01-01',
        change: 0.3
      },
      INFLATION: {
        id: 'INFLATION',
        value: 3.2,
        date: '2024-01-01',
        change: -0.1
      },
      UNEMPLOYMENT: {
        id: 'UNEMPLOYMENT',
        value: 3.7,
        date: '2024-01-01',
        change: -0.2
      },
      INTEREST_RATE: {
        id: 'INTEREST_RATE',
        value: 5.25,
        date: '2024-01-01',
        change: 0.0
      }
    };
    return fallbacks[id] || fallbacks['GDP'];
  }
  private static getFallbackMarketSymbol(symbol: string) {
    const fallbacks: {
      [key: string]: any;
    } = {
      SPY: {
        symbol: 'SPY',
        price: 485.2,
        change: 1.2,
        volume: 45000000
      },
      QQQ: {
        symbol: 'QQQ',
        price: 412.85,
        change: 0.8,
        volume: 32000000
      },
      VTI: {
        symbol: 'VTI',
        price: 248.95,
        change: 1.0,
        volume: 15000000
      },
      ARKK: {
        symbol: 'ARKK',
        price: 58.42,
        change: 2.1,
        volume: 8000000
      }
    };
    return fallbacks[symbol] || fallbacks['SPY'];
  }
  private static getFallbackCurrencyRates() {
    return {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CAD: 1.25,
      AUD: 1.35
    };
  }
  private static analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'increase', 'success', 'profit', 'gain', 'boost', 'rise', 'expansion', 'opportunity'];
    const negativeWords = ['decline', 'loss', 'fall', 'crisis', 'risk', 'concern', 'uncertainty', 'challenge', 'downturn'];
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
  private static calculateImpact(title: string): 'High' | 'Medium' | 'Low' {
    const highImpactWords = ['regulation', 'policy', 'crisis', 'breakthrough', 'acquisition', 'ipo'];
    const lowerTitle = title.toLowerCase();
    if (highImpactWords.some(word => lowerTitle.includes(word))) return 'High';
    return Math.random() > 0.5 ? 'Medium' : 'Low';
  }
  private static getRegionName(countryCode: string): string {
    const regions: {
      [key: string]: string;
    } = {
      us: 'North America',
      gb: 'Europe',
      de: 'Europe',
      jp: 'Asia Pacific',
      au: 'Asia Pacific',
      br: 'Latin America'
    };
    return regions[countryCode] || 'Global';
  }
  private static formatTimestamp(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  }
  private static calculateChange(indicator: string): number {
    // Simulate realistic changes based on indicator type
    const changes: {
      [key: string]: number;
    } = {
      GDP: Math.random() * 2 - 1,
      // -1% to +1%
      INFLATION: Math.random() * 0.5 - 0.25,
      // -0.25% to +0.25%
      UNEMPLOYMENT: Math.random() * 0.3 - 0.15,
      // -0.15% to +0.15%
      INTEREST_RATE: Math.random() * 0.1 - 0.05 // -0.05% to +0.05%
    };
    return changes[indicator] || 0;
  }
  // Fallback data methods
  private static getFallbackNews() {
    const now = new Date();
    return [{
      title: 'Global Tech Markets Show Resilience in Current Quarter',
      summary: 'Despite market volatility, technology sector demonstrates strong fundamentals and growth potential',
      sentiment: 'positive' as const,
      impact: 'High' as const,
      region: 'North America',
      timestamp: 'Just now',
      url: '#'
    }, {
      title: 'European Markets Adapt to New Tech Regulations',
      summary: 'Companies implement changes to comply with latest regulatory framework',
      sentiment: 'neutral' as const,
      impact: 'Medium' as const,
      region: 'Europe',
      timestamp: '1 hour ago',
      url: '#'
    }, {
      title: 'Asian Tech Sector Reports Quarterly Growth',
      summary: 'Regional technology companies exceed market expectations',
      sentiment: 'positive' as const,
      impact: 'Medium' as const,
      region: 'Asia Pacific',
      timestamp: '2 hours ago',
      url: '#'
    }];
  }
  private static getFallbackEconomicData() {
    return [{
      id: 'GDP',
      value: 2.1,
      date: '2024-01-01',
      change: 0.3
    }, {
      id: 'INFLATION',
      value: 3.2,
      date: '2024-01-01',
      change: -0.1
    }, {
      id: 'UNEMPLOYMENT',
      value: 3.7,
      date: '2024-01-01',
      change: -0.2
    }, {
      id: 'INTEREST_RATE',
      value: 5.25,
      date: '2024-01-01',
      change: 0.0
    }];
  }
  private static getFallbackMarketData() {
    return [{
      symbol: 'SPY',
      price: 485.2,
      change: 1.2,
      volume: 45000000
    }, {
      symbol: 'QQQ',
      price: 412.85,
      change: 0.8,
      volume: 32000000
    }, {
      symbol: 'VTI',
      price: 248.95,
      change: 1.0,
      volume: 15000000
    }, {
      symbol: 'ARKK',
      price: 58.42,
      change: 2.1,
      volume: 8000000
    }];
  }
}