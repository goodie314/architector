import { Blueprint } from '../blueprints/blueprint';
import { EventHandler } from '../types/event-handler';

export interface BlueprintAttributes {
    id?: string;
    classNames: string[];
    attributes: { [attributeName: string]: string };
    text?: string;
    children: (Blueprint | string)[];
    handlers: {
        [eventName: string]: EventHandler;
    };
}
