import { ENV } from '../config/environment';
interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}
export class RetryService {
  static async retry<T>(operation: () => Promise<T>, config: RetryConfig = ENV.RETRY_CONFIG): Promise<T> {
    let lastError: Error;
    let delay = config.initialDelay;
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === config.maxRetries) {
          throw error;
        }
        // Exponential backoff with jitter
        const jitter = Math.random() * 200; // Add up to 200ms of random jitter
        await new Promise(resolve => setTimeout(resolve, Math.min(delay + jitter, config.maxDelay)));
        delay *= 2; // Exponential backoff
      }
    }
    throw lastError!;
  }
  static isRetryableError(error: any): boolean {
    // Network errors
    if (error.name === 'NetworkError') return true;
    // Rate limiting responses
    if (error.status === 429) return true;
    // Server errors
    if (error.status >= 500 && error.status < 600) return true;
    // Timeout errors
    if (error.name === 'TimeoutError') return true;
    return false;
  }
}