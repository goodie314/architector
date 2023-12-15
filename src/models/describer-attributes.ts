export interface DescriberAttributes {
    id?: string;
    classNames: string[];
    attributes: { [attributeName: string]: string };
    text?: string;
}
