import { BlueprintComponent } from '../blueprints/blueprint-component';
import { Blueprint } from '../blueprints/blueprint';

export type BlueprintRenderable = Blueprint | BlueprintComponent;

// callback types
export type GenericCallback<T = any> = (value: T) => void;
export type BlueprintCallback<T = any> = (value: T) => BlueprintRenderable;
