import pkg from './package.json';
export default {
    input: 'src/listore.js',
    output: [
        { file: 'dist/listore.js', format: 'umd', name: 'Listore', external: ['clone'] },
        { file: 'dist/listore.esm.js', format: 'es', external: ['clone'] },
    ],
};
