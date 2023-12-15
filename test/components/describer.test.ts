import { Describer } from '../../src/components/describer';

describe('Describer module', () => {
    describe('constructor', () => {
        test.each([['div']])('works with %s passed in', (tagName) => {
            const builder = new Describer(tagName);

            expect(
                Describer.build(builder) instanceof HTMLElement,
            ).toBeTruthy();
        });
    });

    describe('id', () => {
        test('sets the id of the final element', () => {
            const elem = Describer.build(new Describer('div').id('testId'));

            expect(elem.id).toEqual('testId');
        });
    });

    describe('classNames', () => {
        test('sets a single className on the final element', () => {
            const elem = Describer.build(
                new Describer('div').classNames('test'),
            );
            expect(elem.classList.length).toEqual(1);
            expect(elem.classList.contains('test')).toBeTruthy();
        });

        test('sets multiple class namesw on the final element', () => {
            const elem = Describer.build(
                new Describer('div').classNames('test1', 'test2'),
            );

            expect(elem.classList.length).toEqual(2);
            expect(elem.classList.contains('test1')).toBeTruthy();
            expect(elem.classList.contains('test2')).toBeTruthy();
        });
    });

    describe('attribute', () => {
        test('sets single attribute', () => {
            const elem = Describer.build(
                new Describer('div').attribute({
                    key: 'value',
                }),
            );

            expect(elem.getAttributeNames().length).toEqual(1);
            expect(elem.getAttribute('key')).toEqual('value');
        });
    });

    describe('test', () => {
        test('sets text value of element', () => {
            const elem = Describer.build(
                new Describer('div').text('Hello world'),
            );
            expect(elem.textContent).toEqual('Hello world');
        });
    });
});
