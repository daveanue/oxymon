import { useEffect, useRef } from 'react';

export function useAudioPlayer() {
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext
        audioContextRef.current = new AudioContext({ sampleRate: 44100 });

        // Subscribe to audio events
        const cleanup = window.electronAPI.voice.onAudioPlayback(async (buffer: ArrayBuffer) => {
            if (!audioContextRef.current) return;

            try {
                // Cartesia returns raw f32le PCM
                const float32Data = new Float32Array(buffer);
                const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 44100);
                audioBuffer.copyToChannel(float32Data, 0);

                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
            } catch (err) {
                console.error('Failed to play audio:', err);
            }
        });

        return () => {
            cleanup();
            audioContextRef.current?.close();
        }
    }, []);
}
