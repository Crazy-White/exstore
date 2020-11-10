import pkg from './package.json';
export default {
    input: 'src/listore.js',
    output: [
        { file: pkg.main, format: 'cjs', name: 'Listore', external: [ 'clone' ] },
        { file: pkg.module, format: 'es', external: [ 'clone' ] },
        { file: pkg.browser, format: 'umd', name: 'Listore', external: [ 'clone' ] },
    ],
};
