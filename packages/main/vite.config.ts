import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: () => 'index.js',
        },
        rollupOptions: {
            external: [
                'electron',
                ...builtinModules,
                ...builtinModules.map((m) => `node:${m}`),
            ],
        },
        emptyOutDir: true,
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@app/core': resolve(__dirname, '../core/src'),
        },
    },
});
