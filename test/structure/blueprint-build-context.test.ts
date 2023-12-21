import BlueprintBuildContext from '../../src/structure/blueprint-build-context';
import BlueprintService from '../../src/structure/blueprint-service';

describe('BlueprintBuildContext', () => {
    describe('services', () => {
        test('calls callback upon service completion', (done) => {
            const task = jest.fn().mockReturnValue('complete');
            const context = new BlueprintBuildContext().registerService(
                new BlueprintService('testService').registerFunction(
                    'testFn',
                    task,
                ),
            );

            context.queueTask(
                'testService',
                'testFn',
                (val: string) => {
                    expect(val).toEqual('complete');
                    done();
                },
                'abc',
                123,
            );

            expect(task).toHaveBeenCalledTimes(1);
            expect(task).toHaveBeenCalledWith('abc', 123);
        });

        test('calls task that does not exist', () => {
            const callback = jest.fn();
            const context = new BlueprintBuildContext();
            context.queueTask('testService', 'task', callback);
            expect(callback).not.toHaveBeenCalled();
        });

        test('calls task in parent context', (done) => {
            const serviceFn = jest
                .fn()
                .mockReturnValue(Promise.resolve('done'));
            const parent = new BlueprintBuildContext().registerService(
                new BlueprintService('service').registerFunction(
                    'fn',
                    serviceFn,
                ),
            );
            const context = new BlueprintBuildContext();
            context.queueTask(
                'service',
                'fn',
                (value: string) => {
                    expect(serviceFn).toHaveBeenCalledTimes(1);
                    expect(serviceFn).toHaveBeenCalledWith('testParam');
                    expect(value).toEqual('done');
                    done();
                },
                'testParam',
            );

            expect(serviceFn).not.toHaveBeenCalled();

            parent.childContext(context);
        });
    });
});
