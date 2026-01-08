/**
 * Simple logger utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_COLORS = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m',
};

class Logger {
    private context: string;
    private isDev: boolean;

    constructor(context: string) {
        this.context = context;
        this.isDev = process.env.NODE_ENV === 'development';
    }

    private log(level: LogLevel, message: string, ...args: unknown[]) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;

        if (this.isDev) {
            const color = LOG_COLORS[level];
            console[level](`${color}${prefix}${LOG_COLORS.reset}`, message, ...args);
        } else {
            console[level](prefix, message, ...args);
        }
    }

    debug(message: string, ...args: unknown[]) {
        if (this.isDev) {
            this.log('debug', message, ...args);
        }
    }

    info(message: string, ...args: unknown[]) {
        this.log('info', message, ...args);
    }

    warn(message: string, ...args: unknown[]) {
        this.log('warn', message, ...args);
    }

    error(message: string, ...args: unknown[]) {
        this.log('error', message, ...args);
    }
}

/**
 * Create a logger instance with context
 */
export function createLogger(context: string): Logger {
    return new Logger(context);
}

// Default export for convenience
export const logger = createLogger('App');
