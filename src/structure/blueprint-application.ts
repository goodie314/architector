import path from 'path';
import fs from 'fs';
import cwd from '../util/cwd';
import * as esbuild from 'esbuild';
import { writeFileSafe } from '../util/file-util';

export default class BlueprintApplication {
    private readonly title: string;
    private pageMap: Map<string, string>;
    private outputDirName: string;

    constructor(title: string) {
        this.title = title;
        this.pageMap = new Map();
        this.outputDirName = 'bundle';
    }

    addPage(url: string, describablePageLocation: string) {
        if (this.pageMap.has(url)) {
            throw new Error(`URL ${url} is already mapped`);
        }
        this.validateURL(url);
        const pagePath = path.join(cwd, describablePageLocation);
        if (!fs.existsSync(pagePath)) {
            throw new Error(`Could not find describable page at ${pagePath}`);
        }

        this.pageMap.set(url, pagePath);
        return this;
    }

    private validateURL(url: string) {
        if (!url.startsWith('/')) {
            throw new Error(`${url} is invalid. Paths must start with /`);
        } else if (!/^[a-zA-Z0-9_\-/]+$/.test(url)) {
            throw new Error(
                `${url} is invalid. Urls can only contain letters, numbers, underscore, dashes, or forward slashes`,
            );
        }
    }

    outputDir(dirName: string) {
        this.outputDirName = dirName;
        return this;
    }

    async build() {
        if (this.pageMap.size === 0) {
            throw new Error(
                'Cannot build a describable application without any pages. Call addPage before calling build.',
            );
        }
        const template = fs
            .readFileSync(path.join(__dirname, '../template/default.html'))
            .toString();

        const builds = Array.from(this.pageMap.keys()).map((url) => {
            const location = this.pageMap.get(url);
            const outputLocation = path.join(cwd, this.outputDirName, url);

            writeFileSafe(
                path.join(outputLocation, 'index.html'),
                template
                    .replace('{{title}}', this.title)
                    .replace('{{scriptSource}}', 'index.js'),
            );

            return esbuild.build({
                entryPoints: [location],
                bundle: true,
                minify: true,
                logLevel: 'info',
                outfile: path.join(outputLocation, 'index.js'),
            });
        });

        await Promise.all(builds);
    }
}
