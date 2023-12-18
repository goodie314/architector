import { Blueprint } from './blueprint';
import ElementRef from './utils/element-ref';
import { ErrorMessages } from '../constants/error-messages';

export default class BlueprintList<K = string> {
    private elementMap: Map<K, HTMLElement>;
    private order: K[];
    private parentElement: ElementRef<HTMLElement>;

    constructor() {
        this.elementMap = new Map();
        this.order = [];
        this.parentElement = new ElementRef<HTMLElement>();
    }

    get length() {
        return this.order.length;
    }

    get(id: K) {
        return this.elementMap.get(id);
    }

    async push(id: K, describer: Blueprint) {
        if (this.elementMap.has(id)) {
            throw new Error(ErrorMessages.BlueprintList.duplicateId(id));
        }
        const elem = Blueprint.build(describer);

        this.elementMap.set(id, elem);
        this.order.push(id);

        const parent = await this.parentElement.get();
        parent.append(elem);
    }

    async replaceById(id: K, describer: Blueprint) {
        if (!this.elementMap.has(id)) {
            throw new Error(ErrorMessages.BlueprintList.replaceByIdError(id));
        }
        const old = this.elementMap.get(id);

        const elem = Blueprint.build(describer);
        this.elementMap.set(id, elem);

        old.replaceWith(elem);
        await this.parentElement.get();
    }

    async replaceByIndex(index: number, describer: Blueprint) {
        if (index < 0 || index >= this.order.length) {
            throw new Error(
                ErrorMessages.BlueprintList.replaceByIndexError(index),
            );
        }
        const id = this.order[index];
        const old = this.elementMap.get(id);

        const elem = Blueprint.build(describer);
        this.elementMap.set(id, elem);

        old.replaceWith(elem);
        await this.parentElement.get();
    }

    remove(id: K) {
        if (!this.elementMap.has(id)) {
            throw new Error(ErrorMessages.BlueprintList.removeError(id));
        }
        this.elementMap.get(id).remove();
        this.elementMap.delete(id);
        const index = this.order.indexOf(id);
        this.order = this.order.splice(index, 1);
        this.order = this.order.filter((oID) => oID !== id);
    }

    async set(
        descriptions: {
            id: K;
            describer: Blueprint;
        }[],
    ) {
        const updatedMap = new Map<K, HTMLElement>();
        const updatedOrder: K[] = [];
        for (
            let i = 0;
            i < Math.max(this.order.length, descriptions.length);
            i++
        ) {
            // old and new list are same length
            if (i < this.order.length && i < descriptions.length) {
                const oldId = this.order[i];
                const oldElem = this.elementMap.get(oldId);
                const { id, describer } = descriptions[i];
                const elem =
                    this.elementMap.get(id) ?? Blueprint.build(describer);
                updatedOrder.push(id);
                updatedMap.set(id, elem);
                if (oldId !== id) {
                    oldElem.replaceWith(elem);
                }
            }
            // old list is longer
            else if (i < this.order.length) {
                const oldId = this.order[i];
                const oldElem = this.elementMap.get(oldId);
                oldElem.remove();
            }
            // new list is longer
            else {
                const { id, describer } = descriptions[i];
                const elem =
                    this.elementMap.get(id) ?? Blueprint.build(describer);
                updatedOrder.push(id);
                updatedMap.set(id, elem);
                const parent = await this.parentElement.get();
                parent.append(elem);
            }
        }

        this.elementMap = updatedMap;
        this.order = updatedOrder;
    }

    static Build(
        describedList: BlueprintList<any>,
        parentElement: HTMLElement,
    ) {
        describedList.parentElement.set(parentElement);
        return describedList.order.map((id) =>
            describedList.elementMap.get(id),
        );
    }

    // possibly can't keep this method, can't think of a way to do it without
    // returning a promise which wouldn't be a very good flow for the user
    static from<K>(descriptions: { id: K; describer: Blueprint }[]) {
        const list = new BlueprintList<K>();
        descriptions.forEach((description) => {
            list.order.push(description.id);
            list.elementMap.set(
                description.id,
                Blueprint.build(description.describer),
            );
        });

        list.parentElement.get().then((parent) => {
            list.order.forEach((id) => parent.append(list.elementMap.get(id)));
        });

        return list;
    }
}
