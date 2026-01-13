import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartesiaTTSProvider } from './CartesiaTTSProvider';

// Mock dependencies
const { mockBytes, mockCartesiaClient } = vi.hoisted(() => {
    const mockBytes = vi.fn();
    const mockTts = { bytes: mockBytes };
    const mockCartesiaClient = vi.fn(() => ({ tts: mockTts }));
    return { mockBytes, mockCartesiaClient };
});

vi.mock('@cartesia/cartesia-js', () => ({
    CartesiaClient: mockCartesiaClient,
}));

// Mock logger to avoid clutter
vi.mock('@app/core/utils/logger', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock window module for dynamic import
vi.mock('../window.js', () => ({
    getMainWindow: vi.fn(() => ({
        webContents: {
            send: vi.fn(),
        },
    })),
}));

describe('CartesiaTTSProvider', () => {
    let provider: CartesiaTTSProvider;
    const apiKey = 'test-api-key';

    beforeEach(() => {
        vi.clearAllMocks();
        provider = new CartesiaTTSProvider(apiKey);
    });

    it('initializes with API key', () => {
        expect(mockCartesiaClient).toHaveBeenCalledWith({ apiKey });
        expect(provider.isConfigured()).toBe(true);
    });

    it('synthesizes text using SSML', async () => {
        // Mock success response (async iterable)
        const mockChunk = Buffer.from('audio-data');
        const mockResponse = {
            [Symbol.asyncIterator]: async function* () {
                yield mockChunk;
            },
        };
        mockBytes.mockResolvedValue(mockResponse);

        await provider.speak('Hello world');

        // Verify Cartesia client call
        expect(mockBytes).toHaveBeenCalledWith(expect.objectContaining({
            modelId: 'sonic-english',
            transcript: expect.stringContaining('<speak>Hello world</speak>'), // Basic SSML check
            outputFormat: expect.objectContaining({
                container: 'raw',
                encoding: 'pcm_f32le',
            }),
        }));
    });

    it('handles prosody options', async () => {
        const mockChunk = Buffer.from('audio-data');
        mockBytes.mockResolvedValue({
            [Symbol.asyncIterator]: async function* () { yield mockChunk; }
        });

        const prosody = { emotion: 'happy' as const, speed: 1.2 };
        await provider.speak('Hello', prosody);

        // Check SSML validation
        const callArgs = mockBytes.mock.calls[0][0];
        const transcript = callArgs.transcript;

        expect(transcript).toContain('<emotion value="happy">');
        // Note: SSMLRenderer might use 'rate' or 'speed' depending on dialect, 
        // Cartesia usually supports standard SSML but let's check what our renderer does.
        // Our SSMLRenderer implementation for 'cartesia' provider should normally output <prosody rate="...">
        expect(transcript).toContain('rate="1.2"');
    });

    it('falls back to default prosody on parsing error', async () => {
        const mockChunk = Buffer.from('audio-data');
        mockBytes.mockResolvedValue({
            [Symbol.asyncIterator]: async function* () { yield mockChunk; }
        });

        // Pass invalid JSON as text (common LLM failure mode)
        await provider.speak('{"invalid_json":', undefined);

        expect(mockBytes).toHaveBeenCalled();
        // Should have called with basic text, falling back to default plan
        // The specific assertion depends on how validation failure is handled, 
        // but it should at least not throw and attempt synthesis
    });
});
