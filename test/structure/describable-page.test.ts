import DescribablePage from '../../src/structure/describable-page';
import SimpleHtmlComponent from '../components/test-components/simple-html-component';

describe('Describable page module', () => {
    test('successfully render app in the document body', () => {
        new DescribablePage(new SimpleHtmlComponent().compose()).render();

        expect(document.body.childNodes.length).toEqual(1);
        expect(document.body.firstElementChild).toMatchSnapshot();
    });
});
