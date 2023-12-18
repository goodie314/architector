import DescribableApplication from '../../src/structure/describable-application';

new DescribableApplication('todo')
    .addPage('/', './src/page/home.js')
    .build()
    .then();
