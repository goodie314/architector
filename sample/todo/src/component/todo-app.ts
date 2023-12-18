import BlueprintComponent from '../../../../src/blueprints/blueprint-component';
import { Blueprint } from '../../../../src/blueprints/blueprint';
import ElementRef from '../../../../src/util/element-ref';

export default class TodoApp extends BlueprintComponent {
    private tasks: {
        id: number;
        description: string;
        completed: boolean;
    }[] = [];
    private taskInput = new ElementRef<HTMLInputElement>();

    constructor() {
        super('todo-app');
    }

    async handleAddTask() {
        const inputElem = await this.taskInput.get();
        const id = Math.max(0, ...this.tasks.map((task) => task.id)) + 1;
        this.tasks.push({
            id,
            description: inputElem.value,
            completed: false,
        });
        inputElem.value = '';
    }

    compose(): Blueprint {
        const lis = this.tasks.map((task) =>
            this.li(`ID: ${task.id} - ${task.description}`),
        );
        return this.div().append(
            this.div().append(
                this.label('task'),
                this.input('text', 'task').ref(this.taskInput),
                this.button('Add task').click(this.handleAddTask.bind(this)),
            ),
            this.div().append(
                this.h(1).text('Todo:'),
                this.ul().append(...lis),
            ),
        );
    }
}
