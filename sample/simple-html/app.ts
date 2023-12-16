import DescribableApplication from '../../src/structure/describable-application';

export const app = new DescribableApplication('Simple app')
    .addPage('/', './src/page/home-page.ts')
    .addPage('/demo', './src/page/home-page.ts');

app.build()
    .then(() => console.log('done'))
    .catch(console.error);
