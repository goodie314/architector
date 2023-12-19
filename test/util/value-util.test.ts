import { clone, compareValues } from '../../src/util/value-util';

describe('value util', () => {
    describe('compareValues', () => {
        describe('compareObjects', () => {
            test('returns correctly for equivalent single layer objects', () => {
                const obj1 = {
                    id: 'test',
                    value: 123,
                    active: true,
                };

                let obj2 = { ...obj1 };
                expect(compareValues(obj1, obj2)).toEqual(true);

                obj2 = Object.assign({}, obj1, { id: 'test2' });
                expect(compareValues(obj1, obj2)).toEqual(false);

                obj2 = Object.assign({}, obj1, { value: 124 });
                expect(compareValues(obj1, obj2)).toEqual(false);

                obj2 = Object.assign({}, obj1, { active: false });
                expect(compareValues(obj1, obj2)).toEqual(false);
            });

            test('correctly returns for multi-layered object', () => {
                const obj1: any = {
                    sub: {
                        value: 'asdf',
                    },
                };

                let obj2 = Object.assign({}, obj1);
                expect(compareValues(obj1, obj2)).toEqual(true);

                obj2 = {
                    sub: {
                        value: 'diff',
                    },
                };
                expect(compareValues(obj1, obj2)).toEqual(false);

                obj2 = {
                    sub: 'asdf',
                };
                expect(compareValues(obj1, obj2)).toEqual(false);
            });
        });

        describe('compareArrays', () => {
            test('unequal lengths', () => {
                expect(compareValues([1], [1, 2])).toEqual(false);
            });
            test('equal values', () => {
                const testFn = () => {};

                expect(compareValues([1], [1])).toEqual(true);
                expect(compareValues(['test'], ['test'])).toEqual(true);
                expect(compareValues([true, false], [true, false])).toEqual(
                    true,
                );
                expect(compareValues([testFn], [testFn])).toEqual(true);
                expect(
                    compareValues(
                        [
                            {
                                test: 'value',
                            },
                        ],
                        [
                            {
                                test: 'value',
                            },
                        ],
                    ),
                ).toEqual(true);
            });
        });

        describe('compare strings', () => {
            test.each([
                ['asdf', 'asdf', true],
                ['asdf', 'test', false],
                ['test', null, false],
                [undefined, 'test', false],
            ])('given %s and %s returns %s', (val1, val2, equal) => {
                expect(compareValues(val1, val2)).toEqual(equal);
            });
        });

        describe('compare bools', () => {
            test.each([
                [true, true, true],
                [false, false, true],
                [true, false, false],
                [false, true, false],
                [null, true, false],
                [false, undefined, false],
            ])('given %s and %s returns %s', (val1, val2, expected) => {
                expect(compareValues(val1, val2)).toEqual(expected);
            });
        });

        describe('compare numbers', () => {
            test.each([
                [1, 1, true],
                [0, 1, false],
                [1, 1.0, true],
            ])('given %d and %d returns %s', (val1, val2, result) => {
                expect(compareValues(val1, val2)).toEqual(result);
            });

            test.each([
                [0, null, false],
                [1, undefined, false],
            ])('given %d and %s returns %s', (val1, val2, result) => {
                expect(compareValues(val1, val2)).toEqual(result);
            });
        });

        describe('compare functions', () => {
            test('same functions returns true', () => {
                const a = () => {};
                const b = a;
                expect(compareValues(a, b)).toEqual(true);
            });
            test('different functions returns false', () => {
                const a = () => {};
                const b = () => {};
                expect(compareValues(a, b)).toEqual(false);
            });
        });
    });

    describe('clone', () => {
        test('shallowly clones object', () => {
            const obj = {
                id: 1,
                value: 'asdf',
            };
            const cloned = clone(obj);
            cloned.id = 2;
            expect(obj.id).toEqual(1);
            expect(cloned.id).toEqual(2);
        });

        test('clones array', () => {
            const arr = [1, 2, 3, 4];
            const copy = clone(arr);
            copy.push(5);
            expect(arr.length).toEqual(4);
            expect(copy.length).toEqual(5);
        });

        test.each([[1], ['test'], [true], [() => {}]])(
            'clone of primitive value %s returns the same thing',
            (value) => {
                const copy = clone(value);
                expect(copy).toEqual(value);
            },
        );
    });
});
