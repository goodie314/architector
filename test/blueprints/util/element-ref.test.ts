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
});
