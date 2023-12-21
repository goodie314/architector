import BlueprintService from './blueprint-service';
import { GenericCallback } from '../models/generic-callback';
import { ErrorMessages } from '../constants/error-messages';

export default class BlueprintBuildContext {
    private parentContext: Promise<BlueprintBuildContext>;
    private resolveParent: (parent: BlueprintBuildContext) => void;
    private serviceMap: Map<string, BlueprintService>;

    constructor() {
        this.serviceMap = new Map();
        this.parentContext = new Promise<BlueprintBuildContext>(
            (resolve) => (this.resolveParent = resolve),
        );
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

    childContext(buildContext: BlueprintBuildContext) {
        buildContext.resolveParent(this);
    }
}
