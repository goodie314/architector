import BlueprintService from '../../src/structure/blueprint-service';
import { ErrorMessages } from '../../src/constants/error-messages';

describe('BlueprintService', () => {
    describe('callFunction', () => {
        test('call existing task', async () => {
            const callback = jest.fn().mockReturnValue('success');
            const service = new BlueprintService('test').registerFunction(
                'testFn',
                callback,
            );

            expect(service.hasFunction('testFn')).toBeTruthy();
            const result = await service.callFunction(
                'testFn',
                'a',
                1,
                true,
                {},
            );

            expect(result).toEqual('success');
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('a', 1, true, {});
        });

        test('throws error when calling non existent task', async () => {
            const service = new BlueprintService('test');

            await expect(service.callFunction('any')).rejects.toThrow(
                ErrorMessages.BlueprintService.noSuchServiceTask('test', 'any'),
            );
        });

        test('properly returns when calling task with async return value', async () => {
            const task = jest.fn().mockReturnValue(Promise.resolve('response'));
            const service = new BlueprintService('test').registerFunction(
                'testFn',
                task,
            );

            await expect(
                service.callFunction('testFn', 'abc'),
            ).resolves.toEqual('response');

            expect(task).toHaveBeenCalledTimes(1);
            expect(task).toHaveBeenCalledWith('abc');
        });
    });
});
