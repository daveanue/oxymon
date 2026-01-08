/**
 * Voice Provider Interface
 * Abstract interface for voice providers (STT + TTS or Voice-to-Voice)
 */

export interface VoiceProvider {
    /**
     * Provider name for identification
     */
    readonly name: string;

    /**
     * Start listening for voice input
     */
    startListening(): Promise<void>;

    /**
     * Stop listening for voice input
     */
    stopListening(): Promise<void>;

    /**
     * Speak the given text
     */
    speak(text: string): Promise<void>;

    /**
     * Stop current speech
     */
    stopSpeaking(): Promise<void>;

    /**
     * Register callback for when transcript is received
     */
    onTranscript(callback: (text: string) => void): void;

    /**
     * Register callback for when speech ends
     */
    onSpeechEnd(callback: () => void): void;

    /**
     * Check if the provider is properly configured
     */
    isConfigured(): boolean;
}

/**
 * Voice-to-Voice specific provider (e.g., OpenAI Realtime)
 * This handles the entire conversation loop
 */
export interface VoiceToVoiceProvider extends VoiceProvider {
    /**
     * Start a voice-to-voice session
     */
    startSession(): Promise<void>;

    /**
     * End the voice-to-voice session
     */
    endSession(): Promise<void>;

    /**
     * Register callback for assistant responses
     */
    onResponse(callback: (text: string, audio?: Blob) => void): void;
}

/**
 * STT-only provider (e.g., Whisper)
 */
export interface STTProvider {
    readonly name: string;
    transcribe(audio: Blob): Promise<string>;
    startRealtimeTranscription(): Promise<void>;
    stopRealtimeTranscription(): Promise<void>;
    onTranscript(callback: (text: string, isFinal: boolean) => void): void;
    isConfigured(): boolean;
}

/**
 * TTS-only provider (e.g., ElevenLabs)
 */
export interface TTSProvider {
    readonly name: string;
    synthesize(text: string): Promise<Blob>;
    speak(text: string): Promise<void>;
    stop(): Promise<void>;
    isConfigured(): boolean;
}
