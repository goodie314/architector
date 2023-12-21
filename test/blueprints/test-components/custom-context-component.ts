import BlueprintComponent from '../../../src/blueprints/blueprint-component';
import BlueprintBuildContext from '../../../src/structure/blueprint-build-context';

export default class CustomContextComponent extends BlueprintComponent {
    constructor(context = new BlueprintBuildContext()) {
        super(context);
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
