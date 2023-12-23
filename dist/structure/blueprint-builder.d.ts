import { Blueprint } from '../blueprints/blueprint';
import BlueprintContext from './blueprint-context';
import { BlueprintComponent } from '../blueprints/blueprint-component';
import { BlueprintRenderable } from '../models/types';
export declare class BlueprintBuilder {
    private readonly rootComponent;
    private applicationContainer;
    private blueprintContext;
    constructor(rootComponent: Blueprint | BlueprintComponent);
    container(applicationContainer: HTMLElement): this;
    context(blueprintContext: BlueprintContext): this;
    render(): void;
    static build(blueprint: BlueprintRenderable, context?: BlueprintContext<BlueprintComponent>): HTMLElement;
    private static buildBlueprint;
    private static buildFragment;
}
