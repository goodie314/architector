import { Describer } from '../components/describer';
import { EventHandler } from '../types/event-handler';
import DescribedList from '../components/described-list';

export interface DescriberAttributes {
    id?: string;
    classNames: string[];
    attributes: { [attributeName: string]: string };
    text?: string;
    children: (Describer | string | DescribedList)[];
    handlers: {
        [eventName: string]: EventHandler;
    };
}
