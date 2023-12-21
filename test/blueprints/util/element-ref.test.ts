import ElementRef from '../../../src/blueprints/utils/element-ref';
import { Blueprint } from '../../../src/blueprints/blueprint';
import { BlueprintBuilderOptions } from '../../../src/models/blueprint-builder-options';
import BlueprintBuildContext from '../../../src/structure/blueprint-build-context';

const defaultBuilderContext: BlueprintBuilderOptions = {
    parentElem: document.body,
    context: new BlueprintBuildContext(),
};
describe('ElementRef module', () => {
    test('getter and setter', (done) => {
        const elementRef = new ElementRef();
        const elem = Blueprint.build(
            new Blueprint('div'),
            defaultBuilderContext,
        );
        elementRef.get().then((el) => {
            expect(el).toEqual(elem);
            done();
        });
        elementRef.set(elem);
    });

    test('queue task works correctly', () => {
        const elementRef = new ElementRef();
        const elem = document.createElement('div');
        const mockTask = jest.fn();

        elementRef.queueTask(mockTask);

        expect(mockTask).not.toHaveBeenCalled();

        elementRef.set(elem);
        expect(mockTask).toHaveBeenCalledWith(elem);
    });
});
