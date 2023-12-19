import BlueprintComponent from './blueprint-component';
import { Blueprint } from './blueprint';
import DynamicProp from './utils/dynamic-prop';
import ElementRef from './utils/element-ref';
import BlueprintBuilder from '../structure/blueprint-builder';
import { compareValues } from '../util/value-util';

type BlueprintMapper<T> = (dataElement: T) => Blueprint;
type IdMapper<T> = (dataElement: T) => string;

export default class ListBlueprint<T = any> extends BlueprintComponent {
    private readonly blueprintMapper: BlueprintMapper<T>;
    private readonly idMapper: IdMapper<T>;
    private containerRef = new ElementRef();

    private order: string[];
    private elementMap: Map<string, HTMLElement>;

    constructor(
        data: DynamicProp<T[]>,
        blueprintMapper: BlueprintMapper<T>,
        idMapper?: IdMapper<T>,
    ) {
        super();
        this.blueprintMapper = blueprintMapper;
        this.idMapper =
            idMapper ??
            ((dataElement) => {
                // @ts-ignore
                if (dataElement['id'] == null) {
                    throw new Error(
                        `Data elements do not have an id prop. You must pass in a mapping function to produce an id`,
                    );
                }

                // @ts-ignore
                return dataElement['id'];
            });

        this.order = [];
        this.elementMap = new Map();

        data.onElementChange(
            this.containerRef,
            this.handleElementReady.bind(this),
        );
    }

    private handleElementReady(element: HTMLElement) {
        return (values: T[], prevValues: T[]) => {
            const safeGetOrder = (index: number) =>
                index < this.order.length ? this.order[index] : null;

            const updatedOrder = values.map(this.idMapper);
            const updatedMap = new Map<string, HTMLElement>();
            const updatedElements: HTMLElement[] = [];
            const prevValueMap = new Map<string, T>();
            prevValues.forEach((val) =>
                prevValueMap.set(this.idMapper(val), val),
            );

            for (let i = 0; i < updatedOrder.length; i++) {
                const id = updatedOrder[i];
                const oldId = safeGetOrder(i);
                const data = values[i];
                if (id !== oldId) {
                    if (this.elementMap.has(id)) {
                        const updatedElement = compareValues(
                            data,
                            prevValueMap.get(id),
                        )
                            ? this.elementMap.get(id)
                            : BlueprintBuilder.build(
                                  this.blueprintMapper(data),
                              );
                        updatedMap.set(id, updatedElement);
                        updatedElements.push(updatedElement);
                    } else {
                        const updatedElement = BlueprintBuilder.build(
                            this.blueprintMapper(data),
                        );
                        updatedMap.set(id, updatedElement);
                        updatedElements.push(updatedElement);
                    }
                } else {
                    const updatedElement = compareValues(
                        data,
                        prevValueMap.get(id),
                    )
                        ? this.elementMap.get(id)
                        : BlueprintBuilder.build(this.blueprintMapper(data));
                    updatedMap.set(id, updatedElement);
                    updatedElements.push(updatedElement);
                }
            }

            this.order
                .filter((id) => !updatedMap.has(id))
                .map((id) => this.elementMap.get(id))
                .forEach((el) => el.remove());
            this.order = updatedOrder;
            this.elementMap = updatedMap;

            element.innerHTML = '';
            updatedElements.forEach((child) => element.append(child));
        };
    }
    compose(): Blueprint {
        return this.fragment().ref(this.containerRef);
    }
}
