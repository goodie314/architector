import ElementRef from '../../src/util/element-ref';
import { Blueprint } from '../../src/components/blueprint';

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
