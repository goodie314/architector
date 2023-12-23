import BlueprintHTMLBuilder from '../../src/structure/blueprint-html-builder';
import { DefaultHtmlTemplate } from '../../src/blueprints/default-html-template';

describe('DefaultHtmlTemplate', () => {
    test('renders default template', () => {
        expect(
            BlueprintHTMLBuilder(new DefaultHtmlTemplate('test title')),
        ).toMatchSnapshot();
    });
});
