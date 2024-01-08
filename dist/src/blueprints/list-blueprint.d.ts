import { BlueprintComponent } from './blueprint-component';
import { Blueprint } from './blueprint';
import DynamicProp from './utils/dynamic-prop';
type BlueprintMapper<T> = (dataElement: T) => Blueprint;
type IdMapper<T> = (dataElement: T) => string;
export default class ListBlueprint<T = any> extends BlueprintComponent {
    private readonly blueprintMapper;
    private readonly idMapper;
    private containerRef;
    private order;
    private elementMap;
    constructor(data: DynamicProp<T[]>, blueprintMapper: BlueprintMapper<T>, idMapper?: IdMapper<T>);
    private handleElementReady;
    compose(): Blueprint;
}
export {};
