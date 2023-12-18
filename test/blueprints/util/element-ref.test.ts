import ElementRef from '../../../src/blueprints/utils/element-ref';
import { Blueprint } from '../../../src/blueprints/blueprint';

describe('ElementRef module', () => {
    test('getter and setter', (done) => {
        const elementRef = new ElementRef();
        const elem = Blueprint.build(new Blueprint('div'));
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
