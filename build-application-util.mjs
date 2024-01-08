import * as esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['./src/structure/blueprint-application.ts'],
    platform: 'node',
    bundle: true,
    minify: false,
    external: ["esbuild"],
    tsconfig: './application-tsconfig.json',
    outfile: './dist/blueprint-application.js'
}).then()