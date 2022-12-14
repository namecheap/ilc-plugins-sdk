import fg from 'fast-glob';

export function ilcPluginsPath(modulesPath: string): string[] {
    return fg.sync(
        ['ilc-plugin-*/browser.js', '@*/ilc-plugin-*/browser.js'],
        {
            cwd: modulesPath,
            absolute: true,
        }
    );
}