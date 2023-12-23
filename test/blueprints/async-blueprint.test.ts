import { BlueprintBuilder } from '../../src/structure/blueprint-builder';
import AsyncBlueprint from '../../src/blueprints/async-blueprint';
import { Blueprint } from '../../src/blueprints/blueprint';

describe('AsyncBlueprint', () => {
    describe('waitingView', () => {
        test('renders whatever is passed in as the waiting view', () => {
            const promise = new Promise(() => {});
            const elem = BlueprintBuilder.build(
                new AsyncBlueprint(promise).waitingView(
                    new Blueprint('div').id('loading').text('Loading...'),
                ),
            );

            expect(elem.id).toEqual('loading');
            expect(elem.textContent).toEqual('Loading...');
        });
    });

    describe('resolvedView', () => {
        test('displays resolvedView data when promise completes', async () => {
            jest.useFakeTimers();
            const promise = Promise.resolve('resolved');
            const elem = BlueprintBuilder.build(
                new Blueprint('div')
                    .id('container')
                    .append(
                        new AsyncBlueprint(promise).resolvedView((value) =>
                            new Blueprint('div').id(value),
                        ),
                    ),
            );

            await jest.runAllTimersAsync();
            expect(elem.children[0].id).toEqual('resolved');
        });
    });

    describe('rejectedView', () => {
        test('renders rejected view when promise rejects', async () => {
            jest.useFakeTimers();
            const promise = Promise.reject('error message');
            const elem = BlueprintBuilder.build(
                new Blueprint('div')
                    .id('container')
                    .append(
                        new AsyncBlueprint(promise).rejectedView((err) =>
                            new Blueprint('div').id('error').text(err),
                        ),
                    ),
            );

            await jest.runAllTimersAsync();
            expect(elem.children[0].id).toEqual('error');
            expect(elem.children[0].textContent).toEqual('error message');
        });
    });
});
