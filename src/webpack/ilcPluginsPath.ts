import * as fs from 'node:fs';
import { resolve } from 'node:path';

export function ilcPluginsPath(modulesPath: string): string[] {
    const patterns = ['ilc-plugin-*/browser.js', '@*/ilc-plugin-*/browser.js'];
    const files: string[] = [];

    for (const pattern of patterns) {
        const matches = fs.globSync(pattern, { cwd: modulesPath });
        files.push(...matches.map((file) => resolve(modulesPath, file)));
    }

    return files;
}
