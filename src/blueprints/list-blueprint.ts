import BlueprintComponent from './blueprint-component';
import { Blueprint } from './blueprint';
import DynamicProp from './utils/dynamic-prop';

type BlueprintMapper<T> = (dataElement: T) => Blueprint;
type IdMapper<T> = (dataElement: T) => string;

export default class ListBlueprint<T = any> extends BlueprintComponent {
    private data: DynamicProp<T>;
    private blueprintMapper: BlueprintMapper<T>;
    private idMapper: IdMapper<T>;

    constructor(
        data: DynamicProp<T>,
        blueprintMapper: BlueprintMapper<T>,
        idMapper?: IdMapper<T>,
    ) {
        super();
        this.data = data;
        this.blueprintMapper = blueprintMapper;
        this.idMapper = idMapper;
    }
    compose(): Blueprint {
        return this.fragment();
    }
}
