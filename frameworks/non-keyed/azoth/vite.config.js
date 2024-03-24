import { defineConfig } from 'vite';
import azothPlugin from 'azoth/vite-plugin';

export default defineConfig({
    base: '/frameworks/non-keyed/azoth/',
    plugins: [azothPlugin()],
    esbuild: {
        jsx: 'preserve',
    },
    root: './src',
    build: {
        target: 'esnext',
        minify: false,
        outDir: '../',
        assetsDir: './',
        modulePreload: false,
        rollupOptions: {
            output: [{
                format: 'es',
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            }]
        },
    },

});