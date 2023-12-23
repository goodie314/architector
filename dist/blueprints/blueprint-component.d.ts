import { Blueprint } from './blueprint';
import BlueprintContext from '../structure/blueprint-context';
export declare abstract class BlueprintComponent {
    context: BlueprintContext;
    constructor(componentName?: string);
    abstract compose(): Blueprint;
    protected blueprint(tagName: string): Blueprint;
    protected fragment(...blueprints: Blueprint[]): Blueprint;
    protected div(): Blueprint;
    protected span(): Blueprint;
    protected h(number: number): Blueprint;
    protected ul(): Blueprint;
    protected li(text?: string): Blueprint;
    protected form(): Blueprint;
    protected label(forName?: string): Blueprint;
    protected button(text?: string): Blueprint;
    protected input(type?: string, name?: string): Blueprint;
    protected checkbox(): Blueprint;
}
