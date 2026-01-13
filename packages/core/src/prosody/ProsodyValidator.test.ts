/**
 * ProsodyValidator Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
    validateProsody,
    getDefaultProsodyPlan,
    parseProsodyPlan,
} from './ProsodyValidator';
import { PROSODY_CONSTRAINTS } from '../types/ProsodySchema';

describe('ProsodyValidator', () => {
    describe('validateProsody', () => {
        it('should return valid result for correct input', () => {
            const result = validateProsody({
                emotion: 'happy',
                speed: 1.5,
                pitch: 5,
            });

            expect(result.isValid).toBe(true);
            expect(result.plan.emotion).toBe('happy');
            expect(result.plan.speed).toBe(1.5);
            expect(result.plan.pitch).toBe(5);
            expect(result.warnings).toHaveLength(0);
        });

        it('should clamp speed to valid range', () => {
            const result = validateProsody({ speed: 5.0 });
            expect(result.plan.speed).toBe(PROSODY_CONSTRAINTS.speed.max);
            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it('should clamp speed minimum', () => {
            const result = validateProsody({ speed: 0.1 });
            expect(result.plan.speed).toBe(PROSODY_CONSTRAINTS.speed.min);
        });

        it('should clamp pitch to valid range', () => {
            const result = validateProsody({ pitch: 50 });
            expect(result.plan.pitch).toBe(PROSODY_CONSTRAINTS.pitch.max);
        });

        it('should clamp pauseBefore to valid range', () => {
            const result = validateProsody({ pauseBefore: 5000 });
            expect(result.plan.pauseBefore).toBe(PROSODY_CONSTRAINTS.pauseBefore.max);
        });

        it('should use default for invalid emotion', () => {
            const result = validateProsody({ emotion: 'invalid' as any });
            expect(result.plan.emotion).toBe('neutral');
            expect(result.warnings).toContain('Invalid emotion "invalid", defaulting to "neutral"');
        });

        it('should use default for missing emotion', () => {
            const result = validateProsody({});
            expect(result.plan.emotion).toBe('neutral');
        });

        it('should filter non-string emphasis values', () => {
            const result = validateProsody({
                emphasis: ['word1', 123 as any, 'word2', null as any],
            });
            expect(result.plan.emphasis).toEqual(['word1', 'word2']);
        });
    });

    describe('getDefaultProsodyPlan', () => {
        it('should return all default values', () => {
            const plan = getDefaultProsodyPlan();

            expect(plan.emotion).toBe('neutral');
            expect(plan.speed).toBe(1.0);
            expect(plan.pitch).toBe(0);
            expect(plan.pauseBefore).toBe(0);
            expect(plan.pauseAfter).toBe(0);
            expect(plan.emphasis).toEqual([]);
        });
    });

    describe('parseProsodyPlan', () => {
        it('should parse valid JSON string', () => {
            const json = JSON.stringify({ emotion: 'excited', speed: 1.2 });
            const result = parseProsodyPlan(json);

            expect(result.plan.emotion).toBe('excited');
            expect(result.plan.speed).toBe(1.2);
        });

        it('should handle invalid JSON gracefully', () => {
            const result = parseProsodyPlan('not valid json');

            expect(result.isValid).toBe(false);
            expect(result.plan.emotion).toBe('neutral');
            expect(result.warnings).toContain('Failed to parse prosody JSON, using defaults');
        });

        it('should handle object input', () => {
            const result = parseProsodyPlan({ emotion: 'sad' });
            expect(result.plan.emotion).toBe('sad');
        });

        it('should handle null/undefined gracefully', () => {
            const result = parseProsodyPlan(null);
            expect(result.isValid).toBe(false);
            expect(result.plan.emotion).toBe('neutral');
        });

        it('should handle primitive types gracefully', () => {
            const result = parseProsodyPlan(42);
            expect(result.isValid).toBe(false);
            expect(result.warnings).toContain('Invalid prosody input type, using defaults');
        });
    });
});
