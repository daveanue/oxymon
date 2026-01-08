import { build, createServer } from 'vite';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import electron from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Development mode orchestrator
 * Coordinates Vite dev server for renderer and builds for main/preload
 */

const mode = 'development';
process.env.NODE_ENV = mode;
process.env.MODE = mode;

console.log('🚀 Starting development mode...\n');

// 1. Start Vite dev server for renderer
console.log('📦 Starting renderer dev server...');
const rendererServer = await createServer({
    mode,
    root: path.resolve(__dirname, 'renderer'),
    server: {
        port: 5173,
    },
});

await rendererServer.listen();
const rendererUrl = rendererServer.resolvedUrls.local[0];
console.log(`✅ Renderer ready at ${rendererUrl}\n`);

// Store renderer URL for main process
process.env.VITE_DEV_SERVER_URL = rendererUrl;

// 2. Plugin to provide renderer server to other builds
const rendererServerProvider = {
    name: '@app/renderer-server-provider',
    api: {
        getRendererUrl: () => rendererUrl,
    },
};

// 3. Build preload in watch mode
console.log('📦 Building preload...');
await build({
    mode,
    root: path.resolve(__dirname, 'preload'),
    plugins: [rendererServerProvider],
    build: {
        watch: {},
    },
});
console.log('✅ Preload built\n');

// 4. Build main in watch mode
console.log('📦 Building main...');
let electronProcess = null;

await build({
    mode,
    root: path.resolve(__dirname, 'main'),
    plugins: [
        rendererServerProvider,
        {
            name: 'electron-launcher',
            closeBundle() {
                // Kill existing Electron process
                if (electronProcess) {
                    electronProcess.kill();
                }

                // Launch Electron using the electron package (not PATH)
                console.log('\n🖥️  Launching Electron...\n');
                electronProcess = spawn(electron, ['.'], {
                    cwd: path.resolve(__dirname, '..'),
                    stdio: 'inherit',
                    env: {
                        ...process.env,
                        VITE_DEV_SERVER_URL: rendererUrl,
                    },
                });

                electronProcess.on('close', (code) => {
                    if (code !== null) {
                        console.log(`\n⚡ Electron exited with code ${code}`);
                        process.exit(code);
                    }
                });
            },
        },
    ],
    build: {
        watch: {},
    },
});
