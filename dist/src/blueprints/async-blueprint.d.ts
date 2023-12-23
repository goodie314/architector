import { BlueprintComponent } from './blueprint-component';
import { Blueprint } from './blueprint';
import { BlueprintCallback } from '../models/types';
export default class AsyncBlueprint extends BlueprintComponent {
    private promise;
    private _waitingView;
    private _resolvedView;
    private _rejectedView;
    private renderRef;
    constructor(promise: Promise<any>);
    waitingView(blueprint: Blueprint): this;
    resolvedView(callback: BlueprintCallback): this;
    rejectedView(callback: BlueprintCallback): this;
    compose(): Blueprint;
}
