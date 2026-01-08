import { defineConfig } from 'vite';
import { builtinModules } from 'module';

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
});
