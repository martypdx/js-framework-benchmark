import { defineConfig } from 'vite';
import azothPlugin from 'azoth/vite-plugin';

export default defineConfig({
    base: '/frameworks/non-keyed/azoth/',
    plugins: [azothPlugin()],
    esbuild: {
        jsx: 'preserve',
    },
    build: {
        target: 'esnext',
        minify: false,
        outDir: './',
        assetsDir: './assets/',
        modulePreload: false,
        rollupOptions: {
            output: [{
                format: 'es'
            }]
        },
    },

});