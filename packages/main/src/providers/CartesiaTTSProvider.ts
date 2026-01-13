/**
 * Cartesia TTS Provider Integration
 * 
 * Implements the TTS provider interface using Cartesia's Sonic model.
 * Handles SSML rendering and audio synthesis.
 */

import { CartesiaClient } from '@cartesia/cartesia-js';
import { VoiceProvider } from '../../../../core/src/providers/voice/VoiceProvider';
import { renderSSML } from '../../../../core/src/prosody/SSMLRenderer';
import { validateProsody, getDefaultProsodyPlan } from '../../../../core/src/prosody/ProsodyValidator';
import { ProsodyPlan } from '../../../../core/src/types/ProsodySchema';
import { logger } from '../../../../core/src/utils/logger';

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
            model_id: 'sonic-english', // Or make configurable
            voice: {
                mode: 'id',
                id: this.voiceId,
            },
            transcript: ssml,
            output_format: {
                container: 'raw',
                encoding: 'pcm_f32le',
                sample_rate: 44100,
            },
        });

        return response;
    }

    /**
     * Play raw PCM audio buffer
     */
    private async playAudio(buffer: ArrayBuffer): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new AudioContext({ sampleRate: 44100 });
        }

        // Convert raw bytes to AudioBuffer
        // Note: Cartesia returns f32le PCM, which maps directly to detailed Web Audio API
        const float32Data = new Float32Array(buffer);
        const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 44100);
        audioBuffer.copyToChannel(float32Data, 0);

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = audioBuffer;
        this.sourceNode.connect(this.audioContext.destination);
        this.sourceNode.start();

        return new Promise((resolve) => {
            if (this.sourceNode) {
                this.sourceNode.onended = () => resolve();
            } else {
                resolve();
            }
        });
    }
}
