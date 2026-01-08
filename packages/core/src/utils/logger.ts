/**
 * Logger utility using electron-log
 * Works in both main and renderer processes
 * Automatically handles file logging and log rotation
 */

import log from 'electron-log';

// Configure log levels based on environment
if (process.env.NODE_ENV === 'production') {
    log.transports.console.level = 'warn';
    log.transports.file.level = 'info';
} else {
    log.transports.console.level = 'debug';
    log.transports.file.level = 'debug';
}

// Configure file transport
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

/**
 * Create a scoped logger with a specific context
 */
export function createLogger(scope: string) {
    return log.scope(scope);
}

// Default logger instance
export const logger = log;

// Export electron-log as default for convenience
export default log;
