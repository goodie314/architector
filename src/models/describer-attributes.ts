import { Describer } from '../components/describer';
import { EventHandler } from '../types/event-handler';

export interface DescriberAttributes {
    id?: string;
    classNames: string[];
    attributes: { [attributeName: string]: string };
    text?: string;
    children: Describer[];
    handlers: {
        [eventName: string]: EventHandler;
    };
}
