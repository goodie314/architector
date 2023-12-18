import DynamicProp from '../../../src/blueprints/utils/dynamic-prop';

describe('DynamicProp', () => {
    test('default value emitted', (done) => {
        const prop = new DynamicProp('default');
        prop.onChange((value) => {
            expect(value).toEqual('default');
            done();
        })
    })

    test('updated value emitted', (done) => {
        const prop = new DynamicProp('default');
        prop.set('update')
        prop.onChange(value => {
            expect(value).toEqual('update')
            done();
        })
    })

    test('multiple events emitted', () => {
        const callback = jest.fn();

        const prop = new DynamicProp('default');
        prop.onChange(callback);
        prop.set('update');

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenNthCalledWith(1, 'default');
        expect(callback).toHaveBeenNthCalledWith(2, 'update');
    })
})