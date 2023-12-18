import DynamicProp from '../../../src/blueprints/utils/dynamic-prop';
import ElementRef from '../../../src/blueprints/utils/element-ref';

describe('DynamicProp', () => {
    test('default value emitted', (done) => {
        const prop = new DynamicProp('default');
        prop.onChange((value) => {
            expect(value).toEqual('default');
            done();
        });
    });

    test('updated value emitted', (done) => {
        const prop = new DynamicProp('default');
        prop.set('update');
        prop.onChange((value) => {
            expect(value).toEqual('update');
            done();
        });
    });

    test('multiple events emitted', () => {
        const callback = jest.fn();

        const prop = new DynamicProp('default');
        prop.onChange(callback);
        prop.set('update');

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenNthCalledWith(1, 'default');
        expect(callback).toHaveBeenNthCalledWith(2, 'update');
    });

    describe('onElementChange', () => {
        const valueCallback = jest.fn().mockName('valueCallback');
        const elementCallback = jest
            .fn()
            .mockName('elementCallback')
            .mockReturnValue(valueCallback);

        test('registers callback and calls with default value when element is set before value callback', () => {
            const elementRef = new ElementRef();
            const elem = document.createElement('div');
            elementRef.set(elem);
            const prop = new DynamicProp('default');
            prop.onElementChange(elementRef, elementCallback);

            expect(elementCallback).toHaveBeenCalledWith(elem);
            expect(valueCallback).toHaveBeenCalledWith('default');
        });

        test('registers callback and calls with default value when element is set after value callback', () => {
            const elementRef = new ElementRef();
            const elem = document.createElement('div');
            const prop = new DynamicProp('default');
            prop.onElementChange(elementRef, elementCallback);

            expect(elementCallback).not.toHaveBeenCalled();
            expect(valueCallback).not.toHaveBeenCalled();

            elementRef.set(elem);

            expect(elementCallback).toHaveBeenCalledWith(elem);
            expect(valueCallback).toHaveBeenCalledWith('default');
        });

        test('registers callback and calls with non default values when element set after handler', () => {
            const elementRef = new ElementRef();
            const elem = document.createElement('div');
            const prop = new DynamicProp('default');
            prop.onElementChange(elementRef, elementCallback);
            prop.set('update');
            elementRef.set(elem);

            expect(elementCallback).toHaveBeenCalledWith(elem);
            expect(valueCallback).toHaveBeenCalledTimes(1);
            expect(valueCallback).toHaveBeenCalledWith('update');
        });

        test('registers callback and calls with default value and subsequent values', () => {
            const elementRef = new ElementRef();
            const elem = document.createElement('div');
            elementRef.set(elem);
            const prop = new DynamicProp('default');
            prop.onElementChange(elementRef, elementCallback);
            prop.set('update');

            expect(elementCallback).toHaveBeenCalledTimes(1);
            expect(elementCallback).toHaveBeenCalledWith(elem);
            expect(valueCallback).toHaveBeenCalledTimes(2);
            expect(valueCallback).toHaveBeenNthCalledWith(1, 'default');
            expect(valueCallback).toHaveBeenNthCalledWith(2, 'update');

            elementCallback.mockReset();
            valueCallback.mockReset();

            prop.set('update 2');
            prop.set('update 3');

            expect(elementCallback).not.toHaveBeenCalled();
            expect(valueCallback).toHaveBeenCalledTimes(2);
            expect(valueCallback).toHaveBeenNthCalledWith(1, 'update 2');
            expect(valueCallback).toHaveBeenNthCalledWith(2, 'update 3');
        });
    });
});
