import { BlueprintRenderable } from '../models/types';
export declare class BlueprintApplication {
    private pageMap;
    private outputDirName;
    private template;
    constructor(title: string);
    addDefaultHtml(template: BlueprintRenderable): void;
    addPage(url: string, describablePageLocation: string): this;
    private validateURL;
    outputDir(dirName: string): this;
    build(): Promise<void>;
}
