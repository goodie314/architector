import BlueprintHTMLBuilder from '../../src/structure/blueprint-html-builder';
import { Blueprint } from '../../src/blueprints/blueprint';
import SimpleHtmlComponent from '../blueprints/test-components/simple-html-component';

describe('BlueprintHTMLBuilder', () => {
    test('render single blueprint as HTML', () => {
        const html = BlueprintHTMLBuilder(
            new Blueprint('div')
                .id('testId')
                .classNames('class1', 'class2')
                .attribute('name', 'testName')
                .attribute('att2', 'testAtt')
                .text('Hello world'),
        );
        expect(html).toMatchSnapshot();
    });

    test('render multi level blueprint as html', () => {
        const html = BlueprintHTMLBuilder(
            new Blueprint('div').append(
                new Blueprint('div').id('div1').text('Sup'),
                new Blueprint('div').append(
                    new Blueprint('span').text('hom'),
                    new Blueprint('span').text('ie'),
                ),
                new Blueprint('div').text('??'),
            ),
        );
        expect(html).toMatchSnapshot();
    });

    test('render blueprint component as html', () => {
        const html = BlueprintHTMLBuilder(new SimpleHtmlComponent());
        expect(html).toMatchSnapshot();
    });

    test('render string as html', () => {
        const html = BlueprintHTMLBuilder(
            new Blueprint('div').append('hello', 'world'),
        );
        expect(html).toMatchSnapshot();
    });
});
