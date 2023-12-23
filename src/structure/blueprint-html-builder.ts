import { BlueprintComponent } from '../blueprints/blueprint-component';
import { Blueprint } from '../blueprints/blueprint';

const selfClosingTags = ['meta'];
export default function BlueprintHTMLBuilder(
    blueprint: Blueprint | BlueprintComponent | string,
) {
    function builderHelper(
        blueprint: Blueprint | BlueprintComponent | string,
        tabs = 0,
    ): string {
        const parts = Array(tabs).fill('\t');
        if (blueprint instanceof String || typeof blueprint === 'string') {
            parts.push(blueprint);
            return parts.join('');
        } else if (blueprint instanceof BlueprintComponent) {
            blueprint = blueprint.compose();
        }
        blueprint = blueprint as Blueprint;
        if (blueprint.isFragment) {
            return blueprint.plans.children
                .map((child) => builderHelper(child, tabs))
                .join('\n');
        }

        parts.push(`<${blueprint.tagName}`);
        const plans = blueprint.plans;

        if (plans.id) {
            parts.push(` id="${plans.id}"`);
        }
        if (plans.classNames.length) {
            parts.push(` class="${plans.classNames.join(' ')}"`);
        }
        Object.entries(plans.attributes)
            .map(([key, value]) => {
                return value ? ` ${key}="${value}"` : ` ${key}`;
            })
            .forEach((attribute) => parts.push(attribute));

        if (blueprint.tagName.toLowerCase() === '!doctype') {
            parts.push('>');
            return parts.join('');
        }
        if (selfClosingTags.includes(blueprint.tagName)) {
            parts.push('/>');
            return parts.join('');
        }
        parts.push('>');

        if (plans.children.length) {
            parts.push('\n');
        }
        parts.push(
            plans.children
                .map((child) => builderHelper(child, tabs + 1))
                .join('\n'),
        );
        parts.push('\n');
        if (plans.text) {
            parts.push(
                ...Array(tabs + 1)
                    .fill('\t')
                    .join(''),
            );
            parts.push(plans.text);
            parts.push('\n');
        }

        parts.push(...Array(tabs).fill('\t').join(''));
        parts.push(`</${blueprint.tagName}>`);
        return parts.join('');
    }

    return builderHelper(blueprint);
}
