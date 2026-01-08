/**
 * LLM Provider Interface
 * Abstract interface for language model providers (OpenAI, Gemini, Claude)
 */

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LLMOptions {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

export interface LLMProvider {
    /**
     * Provider name for identification
     */
    readonly name: string;

    /**
     * Send a chat message and get response
     */
    chat(messages: Message[], options?: LLMOptions): Promise<string>;

    /**
     * Stream a chat response
     */
    streamChat(
        messages: Message[],
        options?: LLMOptions
    ): AsyncGenerator<string, void, unknown>;

    /**
     * Check if the provider is properly configured
     */
    isConfigured(): boolean;
}

/**
 * Base implementation with common functionality
 */
export abstract class BaseLLMProvider implements LLMProvider {
    abstract readonly name: string;

    abstract chat(messages: Message[], options?: LLMOptions): Promise<string>;

    abstract streamChat(
        messages: Message[],
        options?: LLMOptions
    ): AsyncGenerator<string, void, unknown>;

    abstract isConfigured(): boolean;

    /**
     * Build messages array with optional system prompt
     */
    protected buildMessages(
        messages: Message[],
        systemPrompt?: string
    ): Message[] {
        if (!systemPrompt) return messages;

        const hasSystemMessage = messages.some((m) => m.role === 'system');
        if (hasSystemMessage) return messages;

        return [{ role: 'system', content: systemPrompt }, ...messages];
    }
}
