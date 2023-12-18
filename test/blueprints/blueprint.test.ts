import { Blueprint } from '../../src/blueprints/blueprint';
import ElementRef from '../../src/blueprints/utils/element-ref';
import BlueprintList from '../../src/blueprints/blueprint-list';
import DynamicProp from '../../src/blueprints/utils/dynamic-prop';
import { ErrorMessages } from '../../src/constants/error-messages';

describe('Blueprint module', () => {
    describe('constructor', () => {
        test.each([['div']])('works with %s passed in', (tagName) => {
            const builder = new Blueprint(tagName);

            expect(
                Blueprint.build(builder) instanceof HTMLElement,
            ).toBeTruthy();
        });
    });

    describe('id', () => {
        test('sets the id of the final element', () => {
            const elem = Blueprint.build(new Blueprint('div').id('testId'));

            expect(elem.id).toEqual('testId');
        });

        test('sets the id of the element with a dynamic prop', () => {
            const prop = new DynamicProp('default');
            const elem = Blueprint.build(new Blueprint('div').id(prop));

            expect(elem.id).toEqual('default');

            prop.set('update');

            expect(elem.id).toEqual('update');
        });

        test('sets the id to the latest value when prop is updated early', () => {
            const prop = new DynamicProp('default');
            prop.set('update');
            const elem = Blueprint.build(new Blueprint('div').id(prop));

            expect(elem.id).toEqual('update');
        });
    });

    describe('classNames', () => {
        test('sets a single className on the final element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').classNames('test'),
            );
            expect(elem.classList.length).toEqual(1);
            expect(elem.classList.contains('test')).toBeTruthy();
        });

        test('sets multiple class names on the final element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').classNames('test1', 'test2'),
            );

            expect(elem.classList.length).toEqual(2);
            expect(elem.classList.contains('test1')).toBeTruthy();
            expect(elem.classList.contains('test2')).toBeTruthy();
        });

        test('sets a single dynamic prop on an element', () => {
            const prop = new DynamicProp('default');
            const elem = Blueprint.build(new Blueprint('div').classNames(prop));

            expect(elem.classList.length).toEqual(1);
            expect(elem.classList.contains('default')).toBeTruthy();

            prop.set('update');

            expect(elem.classList.length).toEqual(1);
            expect(elem.classList.contains('update')).toBeTruthy();
        });

        test('sets mixed class names on element. has className conflict with elementProp', () => {
            const prop = new DynamicProp('default');
            const prop2 = new DynamicProp('update');
            const elem = Blueprint.build(
                new Blueprint('div').classNames('default', prop, prop2),
            );

            expect(elem.classList.length).toEqual(2);
            expect(elem.classList.contains('default')).toBeTruthy();
            expect(elem.classList.contains('update')).toBeTruthy();

            prop.set('update');

            expect(elem.classList.length).toEqual(2);
            expect(elem.classList.contains('default')).toBeTruthy();
            expect(elem.classList.contains('update')).toBeTruthy();

            prop2.set('update2');

            expect(elem.classList.length).toEqual(3);
            expect(elem.classList.contains('default')).toBeTruthy();
            expect(elem.classList.contains('update')).toBeTruthy();
            expect(elem.classList.contains('update2')).toBeTruthy();
        });
    });

    describe('attribute', () => {
        test('sets single attribute', () => {
            const elem = Blueprint.build(
                new Blueprint('div').attribute('key', 'value'),
            );

            expect(elem.getAttributeNames().length).toEqual(1);
            expect(elem.getAttribute('key')).toEqual('value');
        });

        test('do not set dynamic attribute with no default', () => {
            const prop = new DynamicProp<string>();
            const elem = Blueprint.build(
                new Blueprint('div').attribute('key', prop),
            );

            expect(elem.hasAttribute('key')).toBeFalsy();
        });

        test('set default dynamic attribute with updates', () => {
            const prop = new DynamicProp('value');
            const elem = Blueprint.build(
                new Blueprint('div').attribute('key', prop),
            );

            expect(elem.getAttribute('key')).toEqual('value');
            prop.set('update');
            expect(elem.getAttribute('key')).toEqual('update');
        });

        test('throws error when duplicate attribute name is set', () => {
            const blueprint = new Blueprint('div').attribute('key', 'value');

            expect(() => blueprint.attribute('key', 'value')).toThrow(
                ErrorMessages.Blueprint.duplicateAttributeKey('key'),
            );
        });
    });

    describe('text', () => {
        test('sets text value of element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').text('Hello world'),
            );
            expect(elem.textContent).toEqual('Hello world');
        });
    });

    describe('append', () => {
        test('appends children to the element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').append(
                    new Blueprint('div').id('elem1'),
                    new Blueprint('div').id('elem2'),
                ),
            );

            expect(elem.children.length).toEqual(2);
            expect(elem.children.item(0).id).toEqual('elem1');
            expect(elem.children.item(1).id).toEqual('elem2');
        });

        test('multiple appends appends the correct number of children', () => {
            const children = Array(5)
                .fill(0)
                .map((n, i) => new Blueprint('div').id(`elem${i}`));

            const elem = Blueprint.build(
                new Blueprint('div')
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

        test('correctly appends text', () => {
            const elem = Blueprint.build(
                new Blueprint('div').append('hello ', 'world').append('!'),
            );

            expect(elem.textContent).toEqual('hello world!');
        });

        test('correctly appends and builds BlueprintList', () => {
            const describedList = new BlueprintList();
            describedList.push('1', new Blueprint('div').id('inner1'));
            describedList.push('2', new Blueprint('div').id('inner2'));

            const elem = Blueprint.build(
                new Blueprint('div').append(describedList),
            );

            expect(elem.children.length).toEqual(2);
            expect(elem.children.item(0).id).toEqual('inner1');
            expect(elem.children.item(1).id).toEqual('inner2');
        });

        test('correctly appends multiple types to an element', () => {
            const describedList = new BlueprintList();
            describedList.push(
                '1',
                new Blueprint('p').id('list1').text('item 1'),
            );
            describedList.push(
                '2',
                new Blueprint('p').id('list2').text('item 2'),
            );

            const elem = Blueprint.build(
                new Blueprint('div').append(
                    new Blueprint('h1').id('title').text('Title'),
                    describedList,
                    'extra',
                ),
            );

            expect(elem.children.length).toEqual(3);
            expect(elem.children.item(0).id).toEqual('title');
            expect(elem.children.item(0).textContent).toEqual('Title');

            expect(elem.children.item(1)).toEqual(describedList.get('1'));
            expect(elem.children.item(2)).toEqual(describedList.get('2'));

            expect(elem.textContent).toEqual('Titleitem 1item 2extra');
        });
    });

    describe('ref', () => {
        test('attach ref to element', async () => {
            const ref = new ElementRef();
            const describer = new Blueprint('div').id('test-element').ref(ref);

            Blueprint.build(describer);
            const element = await ref.get();
            expect(element.id).toEqual('test-element');
        });
    });

    describe('addEventListener', () => {
        test('should throw when target is not an Element', () => {
            const describer = new Blueprint('button').click(() => {
                fail('should not reach here');
            });

            Blueprint.build(describer).dispatchEvent(new Event('test'));
        });
        test('click event', (done) => {
            const describer = new Blueprint('button')
                .id('testButton')
                .click((elem) => {
                    expect(elem.id).toEqual('testButton');
                    done();
                });

            Blueprint.build(describer).click();
        });
    });
});
