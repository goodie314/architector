/**
 * @jest-environment node
 */
import fs from 'fs';
import * as esbuild from 'esbuild';
import DescribableApplication from '../../src/structure/describable-application';

jest.mock('../../src/util/cwd', () => '/base');

jest.mock('fs');
const fsMock = jest.mocked(fs);

jest.mock('esbuild');
const esBuildMock = jest.mocked(esbuild);

describe('Describable application module', () => {
    describe('addPage', () => {
        beforeEach(() => {
            fsMock.existsSync.mockReturnValue(true);
        });

        test('valid path passed in', () => {
            const app = new DescribableApplication('test');
            expect(
                app.addPage(
                    '/test_test/ASDF-asf1234',
                    './describable-page.js',
                ) instanceof DescribableApplication,
            ).toBeTruthy();
            expect(fsMock.existsSync).toHaveBeenCalledWith(
                '/base/describable-page.js',
            );
        });

        test('throws error when url is passed twice', () => {
            const app = new DescribableApplication('test');
            expect(
                app.addPage('/test', './describable-page.js') instanceof
                    DescribableApplication,
            ).toBeTruthy();
            expect(() => app.addPage('/test', '')).toThrowError(
                'URL /test is already mapped',
            );
            expect(fsMock.existsSync).toHaveBeenCalledWith(
                '/base/describable-page.js',
            );
        });

        test('throws error when file path does not exist', () => {
            fsMock.existsSync.mockReturnValue(false);
            const app = new DescribableApplication('test');
            expect(() =>
                app.addPage('/test', './some-other/page'),
            ).toThrowError(
                'Could not find describable page at /base/some-other/page',
            );
            expect(fsMock.existsSync).toHaveBeenCalledWith(
                '/base/some-other/page',
            );
        });

        test('throws error if url does not start with "/"', () => {
            const app = new DescribableApplication('test');
            expect(() =>
                app.addPage('test', './describable-page.js'),
            ).toThrowError(`test is invalid. Paths must start with /`);
            expect(fsMock.existsSync).not.toHaveBeenCalled();
        });

        test('throws error if url contains extension', () => {
            const app = new DescribableApplication('test');
            expect(() =>
                app.addPage('/test/index.js', './describable-page.js'),
            ).toThrowError(
                '/test/index.js is invalid. Urls can only contain letters, numbers, underscore, dashes, or forward slashes',
            );
        });
    });

    describe('build', () => {
        beforeEach(() => {
            fsMock.readFileSync.mockReturnValue('{{title}}');
        });

        test('throws error if app has no pages', async () => {
            const app = new DescribableApplication('test');
            await expect(app.build()).rejects.toThrowError(
                'Cannot build a describable application without any pages. Call addPage before calling build.',
            );
        });

        test('correctly builds one page', async () => {
            fsMock.existsSync.mockReturnValue(true);

            const app = new DescribableApplication('test');
            app.addPage('/test', './page.js');
            await app.build();

            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                '/base/bundle/test/index.html',
                'test',
            );
            expect(esBuildMock.build).toHaveBeenCalledWith({
                entryPoints: ['/base/page.js'],
                bundle: true,
                minify: true,
                logLevel: 'info',
                outfile: '/base/bundle/test/index.js',
            });
        });

        test('builds one page with custom output directory', async () => {
            fsMock.existsSync.mockReturnValue(true);

            const app = new DescribableApplication('test')
                .outputDir('output')
                .addPage('/test', './page.js');
            await app.build();

            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                '/base/output/test/index.html',
                'test',
            );
            expect(esBuildMock.build).toHaveBeenCalledWith({
                entryPoints: ['/base/page.js'],
                bundle: true,
                minify: true,
                logLevel: 'info',
                outfile: '/base/output/test/index.js',
            });
        });
    });
});
