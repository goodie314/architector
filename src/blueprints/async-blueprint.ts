import { BlueprintComponent } from './blueprint-component';
import { Blueprint } from './blueprint';
import { BlueprintCallback } from '../models/types';
import ElementRef from './utils/element-ref';
import { BlueprintBuilder } from '../structure/blueprint-builder';

export default class AsyncBlueprint extends BlueprintComponent {
    private promise: Promise<any>;
    private _waitingView: Blueprint;
    private _resolvedView: BlueprintCallback;
    private _rejectedView: BlueprintCallback;
    private renderRef = new ElementRef();

    constructor(promise: Promise<any>) {
        super();
        this.promise = promise;
        this._waitingView = Blueprint.Fragment();
    }

    waitingView(blueprint: Blueprint) {
        this._waitingView = blueprint;
        return this;
    }

    resolvedView(callback: BlueprintCallback) {
        this._resolvedView = callback;
        return this;
    }

    rejectedView(callback: BlueprintCallback) {
        this._rejectedView = callback;
        return this;
    }

    compose(): Blueprint {
        this.promise
            .then((value) =>
                this.renderRef.get().then((elem) => {
                    elem.innerHTML = '';
                    const updatedView = BlueprintBuilder.build(
                        this._resolvedView(value),
                    );
                    elem.append(updatedView);
                }),
            )
            .catch((err) =>
                this.renderRef.get().then((elem) => {
                    if (this._rejectedView) {
                        elem.innerHTML = '';
                        const updatedView = BlueprintBuilder.build(
                            this._rejectedView(err),
                        );
                        elem.append(updatedView);
                    }
                }),
            );

        return this._waitingView.ref(this.renderRef);
    }
}
