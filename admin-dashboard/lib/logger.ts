/**
 * Logging utility that only logs in development mode.
 * In production, this prevents sensitive error details from being exposed
 * while still allowing for optional integration with error tracking services.
 */

export const logger = {
  /**
   * Log error messages. Only outputs in development mode.
   * @param message - Descriptive error message
   * @param error - Optional error object or additional data
   */
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, optionally send to error tracking service (Sentry, etc.)
    // TODO: Add production error tracking integration
  },

  /**
   * Log warning messages. Only outputs in development mode.
   * @param message - Descriptive warning message
   * @param data - Optional additional data
   */
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * Log informational messages. Only outputs in development mode.
   * @param message - Descriptive info message
   * @param data - Optional additional data
   */
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[INFO] ${message}`, data);
    }
  },
};
