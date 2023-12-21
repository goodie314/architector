import { ErrorMessages } from '../constants/error-messages';

export default class BlueprintService {
    public readonly serviceName: string;
    private services: Map<string, Function>;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.services = new Map();
    }

    registerFunction(name: string, callback: Function) {
        this.services.set(name, callback);
        return this;
    }

    hasFunction(name: string) {
        return this.services.has(name);
    }

    async callFunction(name: string, ...params: any[]) {
        if (!this.hasFunction(name)) {
            throw new Error(
                ErrorMessages.BlueprintService.noSuchServiceTask(
                    this.serviceName,
                    name,
                ),
            );
        }
        const fn = this.services.get(name);
        const result = fn(...params);
        if (result instanceof Promise) {
            return await result;
        } else {
            return result;
        }
    }
}
