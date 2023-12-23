import DynamicProp from '../../src/blueprints/utils/dynamic-prop';
import ListBlueprint from '../../src/blueprints/list-blueprint';
import { Blueprint } from '../../src/blueprints/blueprint';
import { BlueprintBuilder } from '../../src/structure/blueprint-builder';
import * as crypto from 'crypto';

const createElementSpy = jest.spyOn(document, 'createElement');

function setupList(items: number) {
    const prop = new DynamicProp(
        Array(items)
            .fill(0)
            .map((_, i) => ({
                id: `${i + 1}`,
                value: crypto.randomUUID().toString(),
            })),
    );
    const list = new ListBlueprint(prop, (data) =>
        new Blueprint('div').id(data.value.toString()),
    );
    const container = BlueprintBuilder.build(list.compose());

    return {
        prop,
        list,
        container,
    };
}

describe('ListBlueprint', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('growing list', () => {
        test('nothing rendered when no data is passed in', () => {
            const { container } = setupList(0);

            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(container.children.length).toEqual(0);
        });

        test('default value is rendered into list', () => {
            const { prop, container } = setupList(5);

            expect(createElementSpy).toHaveBeenCalledTimes(6);
            expect(container.children.length).toEqual(5);
            prop.currentValue().forEach((el, i) => {
                expect(createElementSpy).toHaveBeenNthCalledWith(i + 2, 'div');
                expect(container.children.item(i).id).toEqual(el.value);
            });
        });

        test('add values onto end of list', () => {
            const { prop, container } = setupList(5);

            expect(createElementSpy).toHaveBeenCalledTimes(6);
            expect(container.children.length).toEqual(5);
            prop.currentValue().forEach((el, i) => {
                expect(container.children.item(i).id).toEqual(el.value);
            });

            createElementSpy.mockClear();
            prop.set([
                ...prop.currentValue(),
                {
                    id: '6',
                    value: '100',
                },
            ]);

            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(container.children.length).toEqual(6);
            prop.currentValue().forEach((el, i) => {
                expect(container.children.item(i).id).toEqual(el.value);
            });
        });
    });

    describe('shrinking list', () => {
        test('removes all elements from list', () => {
            const { prop, container } = setupList(5);

            expect(container.children.length).toEqual(5);

            createElementSpy.mockClear();
            prop.set([]);

            expect(createElementSpy).not.toHaveBeenCalled();
            expect(container.children.length).toEqual(0);
        });

        test('removing elements from end of list removes them from the dom', () => {
            const { prop, container } = setupList(5);

            expect(container.children.length).toEqual(5);

            createElementSpy.mockClear();
            prop.set([...prop.currentValue()].slice(0, -1));

            expect(createElementSpy).toHaveBeenCalledTimes(0);
            expect(container.children.length).toEqual(4);

            prop.currentValue().forEach((data, i) => {
                expect(container.children.item(i).id).toEqual(data.value);
            });
        });
    });

    describe('reorder list', () => {
        test('reverse list order', () => {
            const { prop, container } = setupList(5);

            expect(container.children.length).toEqual(5);
            prop.currentValue().forEach((data, i) => {
                expect(container.children.item(i).id).toEqual(data.value);
            });

            createElementSpy.mockClear();

            prop.set(prop.currentValue().reverse());

            expect(createElementSpy).not.toHaveBeenCalled();
            expect(container.children.length).toEqual(5);
            prop.currentValue().forEach((data, i) => {
                expect(container.children.item(i).id).toEqual(data.value);
            });
        });
    });

    describe('update values', () => {
        test('changing ids re-renders with proper ids', () => {
            const { prop, container } = setupList(5);

            expect(container.children.length).toEqual(5);

            createElementSpy.mockClear();
            const updatedValues = prop.currentValue().map((data) => {
                data.value = crypto.randomUUID().toString();
                return data;
            });
            prop.set(updatedValues);

            expect(createElementSpy).toHaveBeenCalledTimes(5);
            expect(container.children.length).toEqual(5);
            updatedValues.forEach((val, index) => {
                expect(container.children.item(index).id).toEqual(val.value);
            });
        });
    });
});
