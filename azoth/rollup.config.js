import resolve from 'rollup-plugin-node-resolve';
import azoth from 'rollup-plugin-azoth';
// import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

const plugins = [
    azoth(),
    // buble()
    resolve(),
];

if ( process.env.production ) {
    plugins.push( uglify() );
}

export default {
    entry: 'src/main.es6.js',
    dest: 'dist/main.js',
    format: 'iife',
    plugins
};
