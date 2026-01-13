/**
 * Prosody Validator
 * 
 * Validates and clamps prosody plans to TTS-safe ranges.
 * Ensures malformed LLM output still produces valid SSML.
 */

import {
    ProsodyPlan,
    ProsodyEmotion,
    ProsodyValidationResult,
    PROSODY_CONSTRAINTS,
} from '../types/ProsodySchema';

const VALID_EMOTIONS: Set<ProsodyEmotion> = new Set([
    'neutral',
    'happy',
    'sad',
    'excited',
    'sympathetic',
    'frustrated',
    'curious',
    'confident',
    'whisper',
]);

/**
 * Clamp a number to a range.
 */
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Validate and normalize a prosody plan.
 * Invalid values are clamped to safe ranges with warnings.
 */
export function validateProsody(input: Partial<ProsodyPlan>): ProsodyValidationResult {
    const warnings: string[] = [];

    // Validate emotion
    let emotion: ProsodyEmotion = PROSODY_CONSTRAINTS.defaultEmotion;
    if (input.emotion) {
        if (VALID_EMOTIONS.has(input.emotion)) {
            emotion = input.emotion;
        } else {
            warnings.push(`Invalid emotion "${input.emotion}", defaulting to "neutral"`);
        }
    }

    // Validate and clamp speed
    let speed = PROSODY_CONSTRAINTS.speed.default;
    if (input.speed !== undefined) {
        const { min, max } = PROSODY_CONSTRAINTS.speed;
        if (input.speed < min || input.speed > max) {
            warnings.push(`Speed ${input.speed} out of range [${min}, ${max}], clamped`);
        }
        speed = clamp(input.speed, min, max);
    }

    // Validate and clamp pitch
    let pitch = PROSODY_CONSTRAINTS.pitch.default;
    if (input.pitch !== undefined) {
        const { min, max } = PROSODY_CONSTRAINTS.pitch;
        if (input.pitch < min || input.pitch > max) {
            warnings.push(`Pitch ${input.pitch} out of range [${min}, ${max}], clamped`);
        }
        pitch = clamp(input.pitch, min, max);
    }

    // Validate and clamp pauseBefore
    let pauseBefore = PROSODY_CONSTRAINTS.pauseBefore.default;
    if (input.pauseBefore !== undefined) {
        const { min, max } = PROSODY_CONSTRAINTS.pauseBefore;
        if (input.pauseBefore < min || input.pauseBefore > max) {
            warnings.push(`pauseBefore ${input.pauseBefore} out of range [${min}, ${max}], clamped`);
        }
        pauseBefore = clamp(input.pauseBefore, min, max);
    }

    // Validate and clamp pauseAfter
    let pauseAfter = PROSODY_CONSTRAINTS.pauseAfter.default;
    if (input.pauseAfter !== undefined) {
        const { min, max } = PROSODY_CONSTRAINTS.pauseAfter;
        if (input.pauseAfter < min || input.pauseAfter > max) {
            warnings.push(`pauseAfter ${input.pauseAfter} out of range [${min}, ${max}], clamped`);
        }
        pauseAfter = clamp(input.pauseAfter, min, max);
    }

    // Validate emphasis (filter non-strings)
    const emphasis: string[] = Array.isArray(input.emphasis)
        ? input.emphasis.filter((e): e is string => typeof e === 'string')
        : [];

    return {
        isValid: warnings.length === 0,
        plan: {
            emotion,
            speed,
            pitch,
            pauseBefore,
            pauseAfter,
            emphasis,
        },
        warnings,
    };
}

/**
 * Create a default prosody plan.
 */
export function getDefaultProsodyPlan(): Required<ProsodyPlan> {
    return {
        emotion: PROSODY_CONSTRAINTS.defaultEmotion,
        speed: PROSODY_CONSTRAINTS.speed.default,
        pitch: PROSODY_CONSTRAINTS.pitch.default,
        pauseBefore: PROSODY_CONSTRAINTS.pauseBefore.default,
        pauseAfter: PROSODY_CONSTRAINTS.pauseAfter.default,
        emphasis: [],
    };
}

/**
 * Parse JSON string into validated prosody plan.
 * Falls back to defaults on parse failure.
 */
export function parseProsodyPlan(raw: unknown): ProsodyValidationResult {
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return validateProsody(parsed);
        } catch {
            return {
                isValid: false,
                plan: getDefaultProsodyPlan(),
                warnings: ['Failed to parse prosody JSON, using defaults'],
            };
        }
    }

    if (typeof raw === 'object' && raw !== null) {
        return validateProsody(raw as Partial<ProsodyPlan>);
    }

    return {
        isValid: false,
        plan: getDefaultProsodyPlan(),
        warnings: ['Invalid prosody input type, using defaults'],
    };
}
