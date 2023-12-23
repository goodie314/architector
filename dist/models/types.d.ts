import { BlueprintComponent } from '../blueprints/blueprint-component';
import { Blueprint } from '../blueprints/blueprint';
export declare type BlueprintRenderable = Blueprint | BlueprintComponent;
export declare type GenericCallback<T = any> = (value: T) => void;
export declare type BlueprintCallback<T = any> = (value: T) => BlueprintRenderable;
