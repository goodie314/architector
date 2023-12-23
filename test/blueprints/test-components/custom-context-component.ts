import { BlueprintComponent } from '../../../src/blueprints/blueprint-component';
import BlueprintContext from '../../../src/structure/blueprint-context';

export default class CustomContextComponent extends BlueprintComponent {
    constructor(context?: BlueprintContext) {
        super('test');
        if (context) {
            this.context = context;
        }
    }
    callServiceFn(serviceName: string, taskName: string) {
        return new Promise((resolve) => {
            this.context.queueTask(serviceName, taskName, resolve);
        });
    }

    compose() {
        return this.div();
    }
}
