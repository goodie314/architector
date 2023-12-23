export default class BlueprintService {
    readonly serviceName: string;
    private services;
    constructor(serviceName: string);
    registerFunction(name: string, callback: Function): this;
    hasFunction(name: string): boolean;
    callFunction(name: string, ...params: any[]): Promise<any>;
}
