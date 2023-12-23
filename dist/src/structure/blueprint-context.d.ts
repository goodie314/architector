import BlueprintService from './blueprint-service';
import { BlueprintComponent } from '../blueprints/blueprint-component';
import { GenericCallback } from '../models/types';
export default class BlueprintContext<T extends BlueprintComponent = BlueprintComponent> {
    private name;
    private component;
    private parentContext;
    private resolveParent;
    private serviceMap;
    private constructor();
    attachComponent(component: T, name: string): void;
    registerService(service: BlueprintService): this;
    queueTask(serviceName: string, taskName: string, callback: GenericCallback, ...params: any[]): void;
    static createContext(contextName?: string): BlueprintContext<BlueprintComponent>;
    static attachContext(parent: BlueprintContext, child: BlueprintContext): BlueprintContext<BlueprintComponent>;
}
