import pkg from './package.json';
export default {
    input: 'src/listore.js',
    output: [
        { file: pkg.main, format: 'umd', name: 'Listore' },
        { file: pkg.module, format: 'es' },
        { file: pkg.browser, format: 'iife', name: 'Listore' },
    ],
};
