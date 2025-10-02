/**
 * Secure logging utility that prevents sensitive information from being logged in production
 * Only logs to console in development environment
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info';

const isProduction = import.meta.env.PROD;

class SecureLogger {
  private log(level: LogLevel, message: string, data?: any) {
    // Only log in development
    if (!isProduction) {
      console[level](message, data || '');
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: any) {
    this.log('error', message, error);
    
    // In production, we might want to send to error tracking service
    // without exposing sensitive data
    if (isProduction) {
      // TODO: Send sanitized error to monitoring service
      // Example: sendToErrorTracking({ message, timestamp: Date.now() });
    }
  }

  // For Web Vitals and analytics data (safe to log)
  analytics(message: string, data?: any) {
    this.log('log', `[Analytics] ${message}`, data);
  }

  // For debugging sitemap generation (safe to log)
  sitemap(message: string, data?: any) {
    this.log('log', `[Sitemap] ${message}`, data);
  }
}

export const logger = new SecureLogger();