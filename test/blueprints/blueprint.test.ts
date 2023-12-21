import { Blueprint } from '../../src/blueprints/blueprint';
import ElementRef from '../../src/blueprints/utils/element-ref';
import DynamicProp from '../../src/blueprints/utils/dynamic-prop';
import { ErrorMessages } from '../../src/constants/error-messages';
import { BlueprintBuilderOptions } from '../../src/models/blueprint-builder-options';
import BlueprintBuildContext from '../../src/structure/blueprint-build-context';
import CustomContextComponent from './test-components/custom-context-component';
import BlueprintService from '../../src/structure/blueprint-service';

const defaultBuilderContext: BlueprintBuilderOptions = {
    parentElem: document.body,
    context: new BlueprintBuildContext(),
};

describe('Blueprint module', () => {
    describe('constructor', () => {
        test.each([['div']])('works with %s passed in', (tagName) => {
            const builder = new Blueprint(tagName);

            expect(
                Blueprint.build(builder, defaultBuilderContext) instanceof
                    HTMLElement,
            ).toBeTruthy();
        });
    });

    describe('id', () => {
        test('sets the id of the final element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').id('testId'),
                defaultBuilderContext,
            );

            expect(elem.id).toEqual('testId');
        });

        test('sets the id of the element with a dynamic prop', () => {
            const prop = new DynamicProp('default');
            const elem = Blueprint.build(
                new Blueprint('div').id(prop),
                defaultBuilderContext,
            );

            expect(elem.id).toEqual('default');

            prop.set('update');

            expect(elem.id).toEqual('update');
        });

        test('sets the id to the latest value when prop is updated early', () => {
            const prop = new DynamicProp('default');
            prop.set('update');
            const elem = Blueprint.build(
                new Blueprint('div').id(prop),
                defaultBuilderContext,
            );

            expect(elem.id).toEqual('update');
        });
    });

    describe('classNames', () => {
        test('sets a single className on the final element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').classNames('test'),
                defaultBuilderContext,
            );
            expect(elem.classList.length).toEqual(1);
            expect(elem.classList.contains('test')).toBeTruthy();
        });

        test('sets multiple class names on the final element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').classNames('test1', 'test2'),
                defaultBuilderContext,
            );

            expect(elem.classList.length).toEqual(2);
            expect(elem.classList.contains('test1')).toBeTruthy();
            expect(elem.classList.contains('test2')).toBeTruthy();
        });

        test('sets a single dynamic prop on an element', () => {
            const prop = new DynamicProp('default');
            const elem = Blueprint.build(
                new Blueprint('div').classNames(prop),
                defaultBuilderContext,
            );

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
                defaultBuilderContext,
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
                defaultBuilderContext,
            );

            expect(elem.getAttributeNames().length).toEqual(1);
            expect(elem.getAttribute('key')).toEqual('value');
        });

        test('do not set dynamic attribute with no default', () => {
            const prop = new DynamicProp<string>();
            const elem = Blueprint.build(
                new Blueprint('div').attribute('key', prop),
                defaultBuilderContext,
            );

            expect(elem.hasAttribute('key')).toBeFalsy();
        });

        test('set default dynamic attribute with updates', () => {
            const prop = new DynamicProp('value');
            const elem = Blueprint.build(
                new Blueprint('div').attribute('key', prop),
                defaultBuilderContext,
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
                defaultBuilderContext,
            );
            expect(elem.textContent).toEqual('Hello world');
        });

        test('sets dynamic text value on element', () => {
            const prop = new DynamicProp<string>();
            const elem = Blueprint.build(
                new Blueprint('div').text(prop),
                defaultBuilderContext,
            );

            expect(elem.textContent).toEqual('');
            prop.set('Hello world');
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
                defaultBuilderContext,
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
                defaultBuilderContext,
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
                defaultBuilderContext,
            );

            expect(elem.textContent).toEqual('hello world!');
        });

        test('correctly appends multiple types to an element', () => {
            const elem = Blueprint.build(
                new Blueprint('div').append(
                    new Blueprint('h1').id('title').text('Hello'),
                    'world',
                    new Blueprint('span').id('span').text('!'),
                ),
                defaultBuilderContext,
            );

            expect(elem.children.length).toEqual(2);
            expect(elem.children.item(0).id).toEqual('title');
            expect(elem.children.item(0).textContent).toEqual('Hello');

            expect(elem.children.item(1).id).toEqual('span');
            expect(elem.children.item(1).textContent).toEqual('!');

            expect(elem.textContent).toEqual('Helloworld!');
        });
    });

    describe('ref', () => {
        test('attach ref to element', async () => {
            const ref = new ElementRef();
            const describer = new Blueprint('div').id('test-element').ref(ref);

            Blueprint.build(describer, defaultBuilderContext);
            const element = await ref.get();
            expect(element.id).toEqual('test-element');
        });
    });

    describe('addEventListener', () => {
        test('should throw when target is not an Element', () => {
            const describer = new Blueprint('button').click(() => {
                fail('should not reach here');
            });

            Blueprint.build(describer, defaultBuilderContext).dispatchEvent(
                new Event('test'),
            );
        });
        test('click event', (done) => {
            const describer = new Blueprint('button')
                .id('testButton')
                .click((elem) => {
                    expect(elem.id).toEqual('testButton');
                    done();
                });

            Blueprint.build(describer, defaultBuilderContext).click();
        });
    });

    describe('Fragment', () => {
        test('fragment renders in the root', () => {
            const fragment = Blueprint.Fragment(
                new Blueprint('div').id('id1'),
                new Blueprint('div').id('id2'),
            );

            const elements = Blueprint.buildFragment(
                fragment,
                defaultBuilderContext,
            );

            expect(elements.length).toEqual(2);
            expect(elements[0].id).toEqual('id1');
            expect(elements[1].id).toEqual('id2');
        });

        test('fragment renders in parent blueprint', () => {
            const fragment = Blueprint.Fragment(
                new Blueprint('div').id('id1'),
                new Blueprint('div').id('id2'),
            );
            const parent = Blueprint.build(
                new Blueprint('div').id('root').append(fragment),
                defaultBuilderContext,
            );

            expect(parent.id).toEqual('root');
            expect(parent.children.length).toEqual(2);
            expect(parent.children.item(0).id).toEqual('id1');
            expect(parent.children.item(1).id).toEqual('id2');
        });

        test('append fragment in the middle of other items', () => {
            const fragment = Blueprint.Fragment(
                new Blueprint('div').id('id1'),
                new Blueprint('div').id('id2'),
            );
            const parent = Blueprint.build(
                new Blueprint('div')
                    .id('root')
                    .append(new Blueprint('h1').id('title'), fragment, 'Hello'),
                defaultBuilderContext,
            );

            expect(parent.id).toEqual('root');
            expect(parent.children.length).toEqual(3);
            expect(parent.children.item(0).id).toEqual('title');
            expect(parent.children.item(1).id).toEqual('id1');
            expect(parent.children.item(2).id).toEqual('id2');
            expect(parent.textContent).toEqual('Hello');
        });

        test('attaching reference to a fragment returns the parent element', async () => {
            const ref = new ElementRef();
            const fragment = Blueprint.Fragment().ref(ref);
            Blueprint.buildFragment(fragment, defaultBuilderContext);

            const parent = await ref.get();
            expect(parent).toEqual(document.body);
        });

        test('attaching reference to a fragment returns the parent blueprint element', async () => {
            const ref = new ElementRef();
            const fragment = Blueprint.Fragment().ref(ref);
            const element = Blueprint.build(
                new Blueprint('div').append(fragment),
                defaultBuilderContext,
            );
            const parent = await ref.get();

            expect(parent).toEqual(element);
        });

        test('throw error when calling build with a fragment', () => {
            const fragment = Blueprint.Fragment();
            expect(() =>
                Blueprint.build(fragment, defaultBuilderContext),
            ).toThrow(
                ErrorMessages.Blueprint.attemptToBuildFragmentAsBlueprint,
            );
        });

        test('throw error when calling buildFragment with a regular blueprint', () => {
            expect(() =>
                Blueprint.buildFragment(
                    new Blueprint('div'),
                    defaultBuilderContext,
                ),
            ).toThrow(
                ErrorMessages.Blueprint.attemptToBuildBlueprintAsFragment,
            );
        });
    });

    describe('build', () => {
        const buildSpy = jest.spyOn(Blueprint, 'build');

        test('has parentRef set in build context', () => {
            const subBlueprint = new Blueprint('div');
            const blueprint = new Blueprint('div').append(subBlueprint);
            const elem = Blueprint.build(blueprint, defaultBuilderContext);

            expect(buildSpy).toHaveBeenCalledTimes(2);
            expect(buildSpy).toHaveBeenNthCalledWith(
                1,
                blueprint,
                defaultBuilderContext,
            );
            expect(buildSpy).toHaveBeenNthCalledWith(2, subBlueprint, {
                ...defaultBuilderContext,
                parentElem: elem,
            });
        });

        test('passes context down chain with build context', async () => {
            const serviceFn = jest
                .fn()
                .mockReturnValue(Promise.resolve('done'));
            const component = new CustomContextComponent();
            const attachContextSpy = jest.spyOn(component, 'attachContext');
            const context = new BlueprintBuildContext().registerService(
                new BlueprintService('testService').registerFunction(
                    'fn',
                    serviceFn,
                ),
            );
            Blueprint.build(component, {
                ...defaultBuilderContext,
                context,
            });

            expect(attachContextSpy).toHaveBeenCalledTimes(1);
            expect(attachContextSpy).toHaveBeenCalledWith(context);

            const value = await component.callServiceFn('testService', 'fn');
            expect(serviceFn).toHaveBeenCalledTimes(1);
            expect(serviceFn).toHaveBeenCalledWith();
            expect(value).toEqual('done');
        });

        test('service call correctly calls closest context', async () => {
            const parentFn = jest.fn().mockReturnValue('parent');
            const childFn = jest.fn().mockReturnValue('child');
            const parentContext = new BlueprintBuildContext().registerService(
                new BlueprintService('service')
                    .registerFunction('parentFn', parentFn)
                    .registerFunction('fn', () => fail()),
            );
            const childContext = new BlueprintBuildContext().registerService(
                new BlueprintService('service').registerFunction('fn', childFn),
            );

            const component = new CustomContextComponent(childContext);
            const attachContextSpy = jest.spyOn(component, 'attachContext');

            Blueprint.build(new Blueprint('div').append(component), {
                ...defaultBuilderContext,
                context: parentContext,
            });

            expect(attachContextSpy).toHaveBeenCalledTimes(1);
            expect(attachContextSpy).toHaveBeenCalledWith(parentContext);

            let value = await component.callServiceFn('service', 'fn');
            expect(childFn).toHaveBeenCalledTimes(1);
            expect(childFn).toHaveBeenCalledWith();
            expect(value).toEqual('child');

            value = await component.callServiceFn('service', 'parentFn');
            expect(parentFn).toHaveBeenCalledTimes(1);
            expect(parentFn).toHaveBeenCalledWith();
            expect(value).toEqual('parent');
        });
    });
});
