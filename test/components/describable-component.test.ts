import SimpleHtmlComponent from './test-components/simple-html-component';
import { Describer } from '../../src/components/describer';

describe('Describable component module', () => {
    describe('Simple html component', () => {
        test('successfully create component', () => {
            const comp = new SimpleHtmlComponent();
            const el = Describer.build(comp.compose());

            expect(el.tagName).toEqual('DIV');
            expect(el.id).toEqual('test-id');
            expect(el.classList.length).toEqual(2);
            expect(el.classList.contains('class-1')).toBeTruthy();
            expect(el.classList.contains('class-2')).toBeTruthy();
            expect(el.getAttribute('test')).toEqual('test-attribute');
            expect(el.textContent).toEqual('Hello');
        });
    });
});
