/**
 * VAD (Voice Activity Detection) Provider Interface
 * Used to detect when user starts/stops speaking
 */

export interface VADProvider {
    /**
     * Provider name for identification
     */
    readonly name: string;

    /**
     * Start voice activity detection
     */
    startDetection(stream: MediaStream): Promise<void>;

    /**
     * Stop voice activity detection
     */
    stopDetection(): Promise<void>;

    /**
     * Register callback for when speech starts
     */
    onSpeechStart(callback: () => void): void;

    /**
     * Register callback for when speech ends
     * Provides the audio blob of the speech segment
     */
    onSpeechEnd(callback: (audio: Blob) => void): void;

    /**
     * Check if VAD is currently detecting
     */
    isDetecting(): boolean;
}

/**
 * Wake Word Detection Provider
 * Used for "Hey Assistant" style activation
 */
export interface WakeWordProvider {
    /**
     * Provider name
     */
    readonly name: string;

    /**
     * The wake word being detected
     */
    readonly wakeWord: string;

    /**
     * Start listening for wake word
     */
    startListening(): Promise<void>;

    /**
     * Stop listening for wake word
     */
    stopListening(): Promise<void>;

    /**
     * Register callback for when wake word is detected
     */
    onWakeWord(callback: () => void): void;

    /**
     * Check if the provider is configured
     */
    isConfigured(): boolean;
}
