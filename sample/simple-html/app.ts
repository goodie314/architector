import BlueprintApplication from '../../src/structure/blueprint-application';

export const app = new BlueprintApplication('Simple app')
    .addPage('/', './src/page/home-page.ts')
    .addPage('/demo', './src/page/home-page.ts');

app.build()
    .then(() => console.log('done'))
    .catch(console.error);
