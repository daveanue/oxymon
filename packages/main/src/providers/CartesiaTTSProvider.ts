/**
 * Cartesia TTS Provider Integration
 * 
 * Implements the TTS provider interface using Cartesia's Sonic model.
 * Handles SSML rendering and audio synthesis.
 */

import { CartesiaClient } from '@cartesia/cartesia-js';
import { VoiceProvider } from '@app/core/providers/voice/VoiceProvider';
import { renderSSML } from '@app/core/prosody/SSMLRenderer';
import { validateProsody, getDefaultProsodyPlan } from '@app/core/prosody/ProsodyValidator';
import { ProsodyPlan } from '@app/core/types/ProsodySchema';
import { logger } from '@app/core/utils/logger';

export class CartesiaTTSProvider implements VoiceProvider {
    public readonly name = 'cartesia-tts';
    private client: CartesiaClient;
    private voiceId: string;
    private isReady: boolean = false;
    private audioContext: AudioContext | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;

    constructor(apiKey: string, voiceId: string = 'a0e99841-438c-4a64-b679-ae501e7d6091') { // Default to Sonic English
        this.client = new CartesiaClient({ apiKey });
        this.voiceId = voiceId;
        this.isReady = true;
    }

    public isConfigured(): boolean {
        return this.isReady;
    }

    /**
     * Start listening (No-op for TTS-only provider)
     */
    public async startListening(): Promise<void> {
        logger.warn('CartesiaTTSProvider is a TTS-only provider, startListening is a no-op');
    }

    /**
     * Stop listening (No-op for TTS-only provider)
     */
    public async stopListening(): Promise<void> {
        // No-op
    }

    /**
     * Speak text with optional prosody.
     * If prosody is provided in the text (as structured JSON string) or separate arg, it's used.
     * Otherwise defaults to neutral.
     */
    public async speak(text: string, prosody?: ProsodyPlan): Promise<void> {
        if (!this.isReady) {
            throw new Error('CartesiaTTSProvider not initialized');
        }

        try {
            // 1. Prepare Prosody Plan
            let plan: Required<ProsodyPlan>;

            // Allow passing prosody JSON string as text if strict mode isn't enforced
            // This is useful for testing or simple integrations
            if (!prosody && text.startsWith('{') && text.includes('response_text')) {
                try {
                    const parsed = JSON.parse(text);
                    text = parsed.response_text || parsed.text || text;
                    const validated = validateProsody(parsed.prosody_plan || parsed.prosody);
                    plan = validated.plan;
                } catch {
                    plan = getDefaultProsodyPlan();
                }
            } else {
                const validated = validateProsody(prosody || {});
                plan = validated.plan;
            }

            // 2. Render SSML
            const ssml = renderSSML(text, plan, { provider: 'cartesia' });
            logger.info(`Synthesizing SSML: ${ssml}`);

            // 3. Synthesize via Cartesia
            const buffer = await this.synthesizeToBuffer(ssml);

            // 4. Play Audio
            await this.playAudio(buffer);

        } catch (error) {
            logger.error('Cartesia TTS synthesis failed', error);
            throw error;
        }
    }

    public async stopSpeaking(): Promise<void> {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode = null;
        }
        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }
    }

    // Callbacks (No-ops for now)
    public onTranscript(callback: (text: string) => void): void { }
    public onSpeechEnd(callback: () => void): void { }

    /**
     * Internal synthesis method
     */
    private async synthesizeToBuffer(ssml: string): Promise<ArrayBuffer> {
        const response = await this.client.tts.bytes({
            modelId: 'sonic-english',
            voice: {
                mode: 'id',
                id: this.voiceId,
            },
            transcript: ssml,
            outputFormat: {
                container: 'raw',
                encoding: 'pcm_f32le',
                sampleRate: 44100,
            },
        });

        // Response is a Readable stream, collect into buffer
        // @ts-ignore - TS might complain about async iteration on Readable if types aren't perfect
        const chunks: Buffer[] = [];
        for await (const chunk of response) {
            chunks.push(Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }

    /**
     * Play raw PCM audio buffer by sending to renderer.
     * Electron main process cannot play audio directly via Web Audio API.
     */
    private async playAudio(buffer: ArrayBuffer): Promise<void> {
        // Import dynamically to avoid circular dependencies if any
        const { getMainWindow } = await import('../window.js');
        const mainWindow = getMainWindow();

        if (mainWindow) {
            mainWindow.webContents.send('voice:play-audio', buffer);
        } else {
            logger.warn('Cannot play audio: No main window found');
        }
    }
}
