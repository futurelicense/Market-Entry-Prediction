// Using window-specific environment variables or fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  // @ts-ignore - Vite specific environment variable access
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore - Vite specific environment variable access
    return import.meta.env[key] || fallback;
  }
  // Fallback for other environments
  return fallback;
};
export const ENV = {
  API_KEYS: {
    newsData: getEnvVar('VITE_NEWS_DATA_API_KEY', 'pub_18ce305b6bc848c4a93774709a7d50e3'),
    fred: getEnvVar('VITE_FRED_API_KEY', '6fe652d01cea207cdc803ffd6ba8f62f'),
    twelveData: getEnvVar('VITE_TWELVE_DATA_API_KEY', '97a324f803194c938c6bb3871c4dd632'),
    fixer: getEnvVar('VITE_FIXER_API_KEY', '4f4c39534f701312e08e594dc6a93467'),
    openCage: getEnvVar('VITE_OPENCAGE_API_KEY', 'a2e7f21b1fb6467ba0851cbadd8e7f9d'),
    trendSpottr: getEnvVar('VITE_TRENDSPOTTR_API_KEY', '326b544de71477ca48f1a147c041c9fd')
  },
  CORS_PROXY: getEnvVar('VITE_CORS_PROXY_URL', 'https://cors-anywhere.herokuapp.com/'),
  CACHE_DURATION: {
    news: 5 * 60 * 1000,
    // 5 minutes
    economic: 60 * 60 * 1000,
    // 1 hour
    market: 2 * 60 * 1000,
    // 2 minutes
    currency: 30 * 60 * 1000 // 30 minutes
  },
  RATE_LIMITS: {
    news: {
      tokens: 50,
      interval: 60 * 60 * 1000
    },
    // 50 requests per hour
    economic: {
      tokens: 100,
      interval: 60 * 60 * 1000
    },
    // 100 requests per hour
    market: {
      tokens: 200,
      interval: 60 * 60 * 1000
    },
    // 200 requests per hour
    currency: {
      tokens: 100,
      interval: 60 * 60 * 1000
    } // 100 requests per hour
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    initialDelay: 1000,
    // 1 second
    maxDelay: 10000 // 10 seconds
  }
};