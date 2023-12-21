import { Blueprint } from '../blueprints/blueprint';
import { EventHandler } from '../types/event-handler';
import BlueprintComponent from '../blueprints/blueprint-component';

export interface BlueprintAttributes {
    id?: string;
    classNames: string[];
    attributes: { [attributeName: string]: string };
    text?: string;
    children: (Blueprint | BlueprintComponent | string)[];
    handlers: {
        [eventName: string]: EventHandler;
    };
}
