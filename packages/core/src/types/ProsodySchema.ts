/**
 * Prosody Schema Types
 * 
 * Defines the structure for emotional/prosodic delivery instructions
 * that get rendered to SSML for TTS synthesis.
 */

/**
 * Supported emotion values for TTS.
 * These map to Cartesia's <emotion> SSML tag values.
 * Can be extended when switching TTS providers.
 */
export type ProsodyEmotion =
    | 'neutral'
    | 'happy'
    | 'sad'
    | 'excited'
    | 'sympathetic'
    | 'frustrated'
    | 'curious'
    | 'confident'
    | 'whisper';

/**
 * Prosody plan returned by the LLM alongside response text.
 * All fields except `emotion` are optional with sensible defaults.
 */
export interface ProsodyPlan {
    /** Primary emotional tone for delivery */
    emotion: ProsodyEmotion;

    /** Speaking rate multiplier (0.5 = half speed, 2.0 = double) */
    speed?: number;

    /** Pitch adjustment in semitones (-20 to +20) */
    pitch?: number;

    /** Pause before speaking in milliseconds (0-2000) */
    pauseBefore?: number;

    /** Pause after speaking in milliseconds (0-2000) */
    pauseAfter?: number;

    /** Words to emphasize (will be wrapped in <emphasis>) */
    emphasis?: string[];
}

/**
 * Complete response from LLM with text and prosody instructions.
 */
export interface LLMResponse {
    /** The text content to be spoken */
    responseText: string;

    /** Prosody instructions for TTS */
    prosodyPlan: ProsodyPlan;
}

/**
 * Prosody constraints for validation and clamping.
 */
export const PROSODY_CONSTRAINTS = {
    speed: { min: 0.5, max: 2.0, default: 1.0 },
    pitch: { min: -20, max: 20, default: 0 },
    pauseBefore: { min: 0, max: 2000, default: 0 },
    pauseAfter: { min: 0, max: 2000, default: 0 },
    defaultEmotion: 'neutral' as ProsodyEmotion,
};

/**
 * Result of prosody validation.
 */
export interface ProsodyValidationResult {
    /** Whether the input was valid (or fixed via clamping) */
    isValid: boolean;

    /** The validated/clamped prosody plan */
    plan: Required<ProsodyPlan>;

    /** Any warnings about clamped or defaulted values */
    warnings: string[];
}
