import pkg from './package.json';
export default {
    input: 'src/exstore.js',
    output: [
        { file: pkg.main, format: 'umd', name: 'Exstore' },
        { file: pkg.module, format: 'es' },
        { file: pkg.browser, format: 'iife', name: 'Exstore' },
    ],
};
