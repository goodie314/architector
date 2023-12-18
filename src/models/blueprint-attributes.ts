import { Blueprint } from '../components/blueprint';
import { EventHandler } from '../types/event-handler';
import BlueprintList from '../components/blueprint-list';

export interface BlueprintAttributes {
    id?: string;
    classNames: string[];
    attributes: { [attributeName: string]: string };
    text?: string;
    children: (Blueprint | string | BlueprintList)[];
    handlers: {
        [eventName: string]: EventHandler;
    };
}
