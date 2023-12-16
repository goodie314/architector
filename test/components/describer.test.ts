import { Describer } from '../../src/components/describer';
import ElementRef from '../../src/util/element-ref';

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

        test('sets multiple class names on the final element', () => {
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

    describe('text', () => {
        test('sets text value of element', () => {
            const elem = Describer.build(
                new Describer('div').text('Hello world'),
            );
            expect(elem.textContent).toEqual('Hello world');
        });
    });

    describe('append', () => {
        test('appends children to the element', () => {
            const elem = Describer.build(
                new Describer('div').append(
                    new Describer('div').id('elem1'),
                    new Describer('div').id('elem2'),
                ),
            );

            expect(elem.children.length).toEqual(2);
            expect(elem.children.item(0).id).toEqual('elem1');
            expect(elem.children.item(1).id).toEqual('elem2');
        });

        test('multiple appends appends the correct number of children', () => {
            const children = Array(5)
                .fill(0)
                .map((n, i) => new Describer('div').id(`elem${i}`));

            const elem = Describer.build(
                new Describer('div')
                    .append(...children.slice(0, 2))
                    .append(children[2])
                    .append(...children.slice(3)),
            );

            expect(elem.children.length).toEqual(5);
            Array(5)
                .fill(0)
                .forEach((n, i) =>
                    expect(elem.children.item(i).id).toEqual(`elem${i}`),
                );
        });
    });

    describe('ref', () => {
        test('attach ref to element', async () => {
            const ref = new ElementRef();
            const describer = new Describer('div').id('test-element').ref(ref);

            Describer.build(describer);
            const element = await ref.get();
            expect(element.id).toEqual('test-element');
        });
    });

    describe('addEventListener', () => {
        test('should throw when target is not an Element', () => {
            const describer = new Describer('button').click(() => {
                fail('should not reach here');
            });

            Describer.build(describer).dispatchEvent(new Event('test'));
        });
        test('click event', (done) => {
            const describer = new Describer('button')
                .id('testButton')
                .click((elem) => {
                    expect(elem.id).toEqual('testButton');
                    done();
                });

            Describer.build(describer).click();
        });
    });
});
