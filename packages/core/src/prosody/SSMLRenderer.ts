/**
 * SSML Renderer
 * 
 * Converts validated prosody plans to SSML markup for TTS synthesis.
 * Designed to be TTS-provider agnostic with adapter pattern.
 */

import { ProsodyPlan } from '../types/ProsodySchema';

/**
 * SSML dialect for provider-specific markup.
 */
export type SSMLDialect = 'cartesia' | 'elevenlabs' | 'google' | 'amazon';

/**
 * Options for SSML rendering.
 */
export interface SSMLRenderOptions {
    /** Target TTS provider (affects SSML dialect) */
    provider: SSMLDialect;

    /** Whether to wrap in <speak> tags */
    wrapInSpeak?: boolean;
}

/**
 * Render a prosody plan and text to SSML markup.
 * 
 * @param text - The text to speak
 * @param plan - The validated prosody plan
 * @param options - Rendering options
 * @returns SSML string ready for TTS
 */
export function renderSSML(
    text: string,
    plan: Required<ProsodyPlan>,
    options: SSMLRenderOptions = { provider: 'cartesia' }
): string {
    const { provider, wrapInSpeak = true } = options;

    let ssml = text;

    // Apply emphasis to specific words
    if (plan.emphasis.length > 0) {
        ssml = applyEmphasis(ssml, plan.emphasis);
    }

    // Apply prosody (speed, pitch)
    if (plan.speed !== 1.0 || plan.pitch !== 0) {
        ssml = wrapProsody(ssml, plan.speed, plan.pitch);
    }

    // Apply emotion (provider-specific)
    ssml = wrapEmotion(ssml, plan.emotion, provider);

    // Apply pauses
    if (plan.pauseBefore > 0) {
        ssml = `<break time="${plan.pauseBefore}ms"/>${ssml}`;
    }
    if (plan.pauseAfter > 0) {
        ssml = `${ssml}<break time="${plan.pauseAfter}ms"/>`;
    }

    // Wrap in speak tags
    if (wrapInSpeak) {
        ssml = `<speak>${ssml}</speak>`;
    }

    return ssml;
}

/**
 * Apply emphasis to specific words in text.
 */
function applyEmphasis(text: string, words: string[]): string {
    let result = text;
    for (const word of words) {
        // Case-insensitive word boundary match
        const regex = new RegExp(`\\b(${escapeRegex(word)})\\b`, 'gi');
        result = result.replace(regex, '<emphasis>$1</emphasis>');
    }
    return result;
}

/**
 * Wrap text in prosody tags for speed and pitch.
 */
function wrapProsody(text: string, speed: number, pitch: number): string {
    const parts: string[] = [];

    if (speed !== 1.0) {
        // Convert multiplier to percentage: 1.0 = 100%, 1.5 = 150%
        const rate = Math.round(speed * 100);
        parts.push(`rate="${rate}%"`);
    }

    if (pitch !== 0) {
        // Pitch in semitones with sign
        const sign = pitch >= 0 ? '+' : '';
        parts.push(`pitch="${sign}${pitch}st"`);
    }

    if (parts.length === 0) {
        return text;
    }

    return `<prosody ${parts.join(' ')}>${text}</prosody>`;
}

/**
 * Wrap text in emotion tags (provider-specific).
 */
function wrapEmotion(text: string, emotion: string, provider: SSMLDialect): string {
    if (emotion === 'neutral') {
        return text; // No emotion tag needed
    }

    switch (provider) {
        case 'cartesia':
            return `<emotion value="${emotion}">${text}</emotion>`;

        case 'elevenlabs':
            // ElevenLabs uses bracketed cues in text
            return `[${emotion}] ${text}`;

        case 'google':
            // Google Cloud TTS uses bracketed emotions
            return `[${emotion}] ${text}`;

        case 'amazon':
            // Amazon Polly uses amazon:emotion
            return `<amazon:emotion name="${emotion}" intensity="high">${text}</amazon:emotion>`;

        default:
            return text;
    }
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
