import { defineConfig } from 'vite';
import azothPlugin from 'azoth/vite-plugin';

export default defineConfig({
    base: '/frameworks/keyed/azoth/dist/',
    plugins: [azothPlugin()],
    esbuild: {
        jsx: 'preserve',
    },
    build: {
        target: 'esnext',
        // minify: false,
        assetsDir: './',
        modulePreload: false,
    },

});