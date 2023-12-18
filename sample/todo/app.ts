import BlueprintApplication from '../../src/structure/blueprint-application';

new BlueprintApplication('todo')
    .addPage('/', './src/page/home.js')
    .build()
    .then();
