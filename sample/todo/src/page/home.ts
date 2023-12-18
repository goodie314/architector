import DescribablePage from '../../../../src/structure/describable-page';
import TodoApp from '../component/todo-app';

new DescribablePage(new TodoApp().compose()).render();
