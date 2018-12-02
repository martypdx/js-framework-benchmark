import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import azoth from 'rollup-plugin-azoth';
import cleanup from 'rollup-plugin-cleanup';

import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const buildDir = 'dist';

const azothPlugin = azoth({ 
    async onhtml(htmlMap) {
        const entries = [...htmlMap.entries()];
        console.log('entries', entries.length);

        const html = entries
            .map(([id, html]) => `<template id="${id}">${html}</template>`)
            .join('\n');

        const indexFile = await readFile('src/index.html', 'utf8');
        const fullIndex = indexFile.replace('<!-- templates -->', html);

        await writeFile(`${buildDir}/index.html`, fullIndex);
    }
});

export default {
    input: 'src/main.js',
    plugins: [
        azothPlugin,
        resolve({ jsnext: true, module: true }),
        common(),
        cleanup()
    ],
    output: {
        format: 'iife',
        file: `${buildDir}/bundle.js`,
    }
};