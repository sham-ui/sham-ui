import { babel } from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import pkg from './package.json';

export default {
    input: './src/index.js',
    external: [
        /@babel\/runtime/,
        /@corejs/,
        'nanoid'
    ],
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'es' }
    ],
    plugins: [
        cleaner( {
            targets: [ './lib/' ]
        } ),
        babel( {
            exclude: [ 'node_modules/**' ],
            babelHelpers: 'runtime'
        } )
    ]
};
