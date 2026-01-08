import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, createLogger } from './logger';

describe('Logger', () => {
    beforeEach(() => {
        // Clear any previous mocks
        vi.clearAllMocks();
    });

    it('should have default logger instance', () => {
        expect(logger).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.error).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.debug).toBeDefined();
    });

    it('should create scoped logger', () => {
        const scopedLogger = createLogger('TestScope');
        expect(scopedLogger).toBeDefined();
        expect(scopedLogger.info).toBeDefined();
    });

    it('should log messages without throwing', () => {
        // Mock console to prevent actual logging during tests
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        expect(() => {
            logger.info('Test info message');
            logger.error('Test error message');
            logger.warn('Test warning message');
            logger.debug('Test debug message');
        }).not.toThrow();

        consoleSpy.mockRestore();
    });

    it('should create logger with custom scope', () => {
        const customLogger = createLogger('CustomScope');
        expect(customLogger).toBeDefined();

        expect(() => {
            customLogger.info('Scoped message');
        }).not.toThrow();
    });
});
