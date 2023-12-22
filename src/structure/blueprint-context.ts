import BlueprintService from './blueprint-service';
import { GenericCallback } from '../models/generic-callback';
import BlueprintComponent from '../blueprints/blueprint-component';

export default class BlueprintContext<
    T extends BlueprintComponent = BlueprintComponent,
> {
    private name: string;
    private component: T;

    private parentContext: Promise<BlueprintContext>;
    private resolveParent: (parent: BlueprintContext) => void;
    private serviceMap: Map<string, BlueprintService>;

    private constructor(name = 'default') {
        this.name = name;
        this.serviceMap = new Map();
        this.parentContext = new Promise<BlueprintContext>(
            (resolve) => (this.resolveParent = resolve),
        );
    }

    attachComponent(component: T, name: string) {
        this.component = component;
        this.name = name;
    }

    registerService(service: BlueprintService) {
        this.serviceMap.set(service.serviceName, service);
        return this;
    }

    queueTask(
        serviceName: string,
        taskName: string,
        callback: GenericCallback,
        ...params: any[]
    ) {
        if (!this.serviceMap.has(serviceName)) {
            this.parentContext.then((parent) =>
                parent.queueTask(serviceName, taskName, callback, ...params),
            );
        } else {
            const service = this.serviceMap.get(serviceName);
            if (service.hasFunction(taskName)) {
                service.callFunction(taskName, ...params).then(callback);
            } else {
                this.parentContext.then((parent) =>
                    parent.queueTask(
                        serviceName,
                        taskName,
                        callback,
                        ...params,
                    ),
                );
            }
        }
    }

    static createContext(contextName = 'default') {
        return new BlueprintContext(contextName);
    }

    static attachContext(parent: BlueprintContext, child: BlueprintContext) {
        child.resolveParent(parent);
        return child;
    }
}
