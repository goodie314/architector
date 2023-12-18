import BlueprintList from '../../src/components/blueprint-list';
import { Blueprint } from '../../src/components/blueprint';
import { ErrorMessages } from '../../src/constants/error-messages';
import ElementRef from '../../src/util/element-ref';

describe('BlueprintList module', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('get', () => {
        test('gets an element by id', () => {
            const describedList = new BlueprintList();
            describedList.push('1', new Blueprint('div').id('elemId'));

            expect(describedList.get('1').id).toEqual('elemId');
        });
    });

    describe('push', () => {
        test('adds an element to the list after parent is available', (done) => {
            const describedList = new BlueprintList();
            expect(describedList.length).toEqual(0);
            describedList
                .push('1', new Blueprint('div').id('elemId'))
                .then(() => {
                    expect(describedList.length).toEqual(1);
                    done();
                });
            BlueprintList.Build(describedList, document.body);
        });

        test('throws error when id is already in the list', async () => {
            const describedList = new BlueprintList();
            describedList.push('1', new Blueprint('div')).then();

            BlueprintList.Build(describedList, document.createElement('div'));

            await expect(
                describedList.push('1', new Blueprint('div')),
            ).rejects.toThrow(ErrorMessages.DescribedList.duplicateId('1'));
        });
    });

    describe('replaceById', () => {
        test('replaces element in the list with new one', async () => {
            const list = new BlueprintList();
            BlueprintList.Build(list, document.body);
            await list.push('1', new Blueprint('div').id('oldId'));

            expect(document.body.firstElementChild.id).toEqual('oldId');
            expect(list.get('1').id).toEqual('oldId');

            await list.replaceById('1', new Blueprint('div').id('newId'));
            expect(document.body.firstElementChild.id).toEqual('newId');
            expect(list.get('1').id).toEqual('newId');
        });

        test('throws error when id does not exist', async () => {
            const list = new BlueprintList();
            BlueprintList.Build(list, document.body);
            await expect(
                list.replaceById('1', new Blueprint('div')),
            ).rejects.toThrow(
                ErrorMessages.DescribedList.replaceByIdError('1'),
            );
        });
    });

    describe('replaceByIndex', () => {
        test('correctly replaces the nth element', async () => {
            const list = new BlueprintList();
            BlueprintList.Build(list, document.body);
            await list.push('1', new Blueprint('div').id('oldId1'));
            await list.push('2', new Blueprint('div').id('oldId2'));

            expect(document.body.children.length).toEqual(2);
            expect(document.body.firstElementChild.id).toEqual('oldId1');
            expect(document.body.children.item(1).id).toEqual('oldId2');

            await list.replaceByIndex(1, new Blueprint('div').id('newId'));

            expect(document.body.children.length).toEqual(2);
            expect(document.body.firstElementChild.id).toEqual('oldId1');
            expect(document.body.children.item(1).id).toEqual('newId');
        });

        test('throws error when index is out of bounds', async () => {
            const list = new BlueprintList();
            BlueprintList.Build(list, document.body);
            await list.push('1', new Blueprint('div'));

            await expect(
                list.replaceByIndex(-1, new Blueprint('div')),
            ).rejects.toThrow(
                ErrorMessages.DescribedList.replaceByIndexError(-1),
            );
            await expect(
                list.replaceByIndex(3, new Blueprint('div')),
            ).rejects.toThrow(
                ErrorMessages.DescribedList.replaceByIndexError(3),
            );
        });
    });

    describe('remove', () => {
        test('successfully removes an element by id after it was rendered', async () => {
            const list = new BlueprintList();
            BlueprintList.Build(list, document.body);
            await list.push('1', new Blueprint('div'));

            expect(document.body.children.length).toEqual(1);

            list.remove('1');
            expect(list.length).toEqual(0);
            expect(document.body.children.length).toEqual(0);
        });

        test('successfully removes an element by id before it was ever rendered', () => {
            const list = new BlueprintList();
            list.push('1', new Blueprint('div'));
            list.remove('1');

            expect(list.length).toEqual(0);
            BlueprintList.Build(list, document.body);
            expect(document.body.children.length).toEqual(0);
        });

        test('throws error when id is not in the list', () => {
            const list = new BlueprintList();
            expect(() => list.remove('1')).toThrow(
                ErrorMessages.DescribedList.removeError('1'),
            );
        });
    });

    describe('set', () => {
        test('creates a list from an empty list after render', async () => {
            const list = new BlueprintList<number>();
            BlueprintList.Build(list, document.body);
            const items = Array(2)
                .fill(0)
                .map((n, i) => ({
                    id: i,
                    describer: new Blueprint('div'),
                }));

            await list.set(items);
            expect(list.length).toEqual(2);
        });

        test('creates a list from an empty list before render', (done) => {
            const list = new BlueprintList<number>();
            const items = Array(2)
                .fill(0)
                .map((n, i) => ({
                    id: i,
                    describer: new Blueprint('div'),
                }));

            list.set(items).then(() => {
                expect(document.body.children.length).toEqual(2);
                done();
            });

            expect(document.body.children.length).toEqual(0);
            BlueprintList.Build(list, document.body);
        });

        test('replacing list with more items just concatenates to the end', async () => {
            const list = new BlueprintList<number>();
            BlueprintList.Build(list, document.body);
            const ref1 = new ElementRef();
            const ref2 = new ElementRef();
            let items = [
                {
                    id: 1,
                    describer: new Blueprint('div').ref(ref1),
                },
                {
                    id: 2,
                    describer: new Blueprint('div').ref(ref2),
                },
            ];
            await list.set(items);

            expect(list.length).toEqual(2);
            expect(document.body.children.length).toEqual(2);

            items = Array(5)
                .fill(0)
                .map((n, i) => ({
                    id: i,
                    describer: new Blueprint('div'),
                }));
            await list.set(items);

            expect(list.length).toEqual(5);
            expect(document.body.children.length).toEqual(5);

            let elem = await ref1.get();
            expect(document.body.children.item(0)).toEqual(elem);

            elem = await ref2.get();
            expect(document.body.children.item(1)).toEqual(elem);
        });
    });

    describe('from', () => {
        test.skip('create list from descriptor list', () => {
            const items = Array(5)
                .fill(0)
                .map((n, i) => ({
                    id: i,
                    describer: new Blueprint('div'),
                }));

            const list = BlueprintList.from(items);

            expect(list.length).toEqual(5);

            BlueprintList.Build(list, document.body);

            expect(document.body.children.length).toEqual(5);
        });
    });
});
