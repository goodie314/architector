import BlueprintBuilder from '../../../../src/structure/blueprint-builder';
import TodoApp from '../component/todo-app';

new BlueprintBuilder(new TodoApp().compose()).render();
