/**
 * SSMLRenderer Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { renderSSML } from './SSMLRenderer';
import { getDefaultProsodyPlan } from './ProsodyValidator';

describe('SSMLRenderer', () => {
    describe('renderSSML', () => {
        it('should render basic text with speak tags', () => {
            const plan = getDefaultProsodyPlan();
            const ssml = renderSSML('Hello world', plan);

            expect(ssml).toBe('<speak>Hello world</speak>');
        });

        it('should render emotion tag for Cartesia', () => {
            const plan = { ...getDefaultProsodyPlan(), emotion: 'excited' as const };
            const ssml = renderSSML('Great news!', plan, { provider: 'cartesia' });

            expect(ssml).toContain('<emotion value="excited">');
            expect(ssml).toContain('Great news!');
        });

        it('should render bracketed emotion for ElevenLabs', () => {
            const plan = { ...getDefaultProsodyPlan(), emotion: 'happy' as const };
            const ssml = renderSSML('Hello', plan, { provider: 'elevenlabs' });

            expect(ssml).toContain('[happy]');
        });

        it('should render amazon:emotion for Polly', () => {
            const plan = { ...getDefaultProsodyPlan(), emotion: 'sad' as const };
            const ssml = renderSSML('Goodbye', plan, { provider: 'amazon' });

            expect(ssml).toContain('<amazon:emotion name="sad"');
        });

        it('should skip emotion tag for neutral', () => {
            const plan = getDefaultProsodyPlan();
            const ssml = renderSSML('Hello', plan);

            expect(ssml).not.toContain('emotion');
            expect(ssml).toBe('<speak>Hello</speak>');
        });

        it('should render prosody tags for speed', () => {
            const plan = { ...getDefaultProsodyPlan(), speed: 1.5 };
            const ssml = renderSSML('Fast', plan);

            expect(ssml).toContain('<prosody rate="150%">');
        });

        it('should render prosody tags for pitch', () => {
            const plan = { ...getDefaultProsodyPlan(), pitch: 5 };
            const ssml = renderSSML('High', plan);

            expect(ssml).toContain('pitch="+5st"');
        });

        it('should render negative pitch correctly', () => {
            const plan = { ...getDefaultProsodyPlan(), pitch: -10 };
            const ssml = renderSSML('Low', plan);

            expect(ssml).toContain('pitch="-10st"');
        });

        it('should render break tags for pauses', () => {
            const plan = { ...getDefaultProsodyPlan(), pauseBefore: 500, pauseAfter: 300 };
            const ssml = renderSSML('Pause', plan);

            expect(ssml).toContain('<break time="500ms"/>');
            expect(ssml).toContain('<break time="300ms"/>');
        });

        it('should render emphasis on specific words', () => {
            const plan = { ...getDefaultProsodyPlan(), emphasis: ['important'] };
            const ssml = renderSSML('This is important info', plan);

            expect(ssml).toContain('<emphasis>important</emphasis>');
        });

        it('should respect wrapInSpeak option', () => {
            const plan = getDefaultProsodyPlan();
            const ssml = renderSSML('Hello', plan, { provider: 'cartesia', wrapInSpeak: false });

            expect(ssml).not.toContain('<speak>');
            expect(ssml).toBe('Hello');
        });
    });
});
