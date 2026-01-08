/**
 * Configuration management
 */

export interface AppConfig {
    // LLM providers
    openaiApiKey?: string;
    anthropicApiKey?: string;
    googleAiApiKey?: string;

    // Voice providers
    elevenLabsApiKey?: string;
    picovoiceAccessKey?: string;

    // Supabase
    supabaseUrl?: string;
    supabaseAnonKey?: string;

    // App settings
    devServerUrl?: string;
}

/**
 * Get configuration from environment variables
 */
export function getConfig(): AppConfig {
    return {
        openaiApiKey: process.env.OPENAI_API_KEY,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        googleAiApiKey: process.env.GOOGLE_AI_API_KEY,
        elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
        picovoiceAccessKey: process.env.PICOVOICE_ACCESS_KEY,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
        devServerUrl: process.env.VITE_DEV_SERVER_URL,
    };
}

/**
 * Validate required configuration
 */
export function validateConfig(
    config: AppConfig,
    required: (keyof AppConfig)[]
): { valid: boolean; missing: string[] } {
    const missing = required.filter((key) => !config[key]);
    return {
        valid: missing.length === 0,
        missing,
    };
}
