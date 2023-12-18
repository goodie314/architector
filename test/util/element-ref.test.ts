import ElementRef from '../../src/util/element-ref';
import { Describer } from '../../src/components/describer';

describe('ElementRef module', () => {
    test('getter and setter', (done) => {
        const elementRef = new ElementRef();
        const elem = Describer.build(new Describer('div'));
        elementRef.get().then((el) => {
            expect(el).toEqual(elem);
            done();
        });
        elementRef.set(elem);
    });
});
