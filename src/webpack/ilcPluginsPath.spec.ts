import { expect } from 'chai';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ilcPluginsPath } from './ilcPluginsPath';

describe('ilcPluginsPath', () => {
    let testDir: string;

    beforeEach(() => {
        // Create a temporary test directory
        testDir = join(tmpdir(), `ilc-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        // Clean up test directory
        rmSync(testDir, { recursive: true, force: true });
    });

    it('should find plugins matching ilc-plugin-* pattern', () => {
        // Create test plugin directories
        const plugin1Path = join(testDir, 'ilc-plugin-foo');
        mkdirSync(plugin1Path, { recursive: true });
        writeFileSync(join(plugin1Path, 'browser.js'), '');

        const plugin2Path = join(testDir, 'ilc-plugin-bar');
        mkdirSync(plugin2Path, { recursive: true });
        writeFileSync(join(plugin2Path, 'browser.js'), '');

        const result = ilcPluginsPath(testDir);

        expect(result).to.have.lengthOf(2);
        expect(result).to.include(resolve(testDir, 'ilc-plugin-foo/browser.js'));
        expect(result).to.include(resolve(testDir, 'ilc-plugin-bar/browser.js'));
    });

    it('should find scoped plugins matching @*/ilc-plugin-* pattern', () => {
        // Create test scoped plugin directory
        const scopePath = join(testDir, '@scope');
        const pluginPath = join(scopePath, 'ilc-plugin-baz');
        mkdirSync(pluginPath, { recursive: true });
        writeFileSync(join(pluginPath, 'browser.js'), '');

        const result = ilcPluginsPath(testDir);

        expect(result).to.have.lengthOf(1);
        expect(result).to.include(resolve(testDir, '@scope/ilc-plugin-baz/browser.js'));
    });

    it('should find both regular and scoped plugins', () => {
        // Create regular plugin
        const plugin1Path = join(testDir, 'ilc-plugin-regular');
        mkdirSync(plugin1Path, { recursive: true });
        writeFileSync(join(plugin1Path, 'browser.js'), '');

        // Create scoped plugin
        const scopePath = join(testDir, '@company');
        const plugin2Path = join(scopePath, 'ilc-plugin-scoped');
        mkdirSync(plugin2Path, { recursive: true });
        writeFileSync(join(plugin2Path, 'browser.js'), '');

        const result = ilcPluginsPath(testDir);

        expect(result).to.have.lengthOf(2);
        expect(result).to.include(resolve(testDir, 'ilc-plugin-regular/browser.js'));
        expect(result).to.include(resolve(testDir, '@company/ilc-plugin-scoped/browser.js'));
    });

    it('should return empty array when no plugins found', () => {
        const result = ilcPluginsPath(testDir);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return absolute paths', () => {
        const pluginPath = join(testDir, 'ilc-plugin-test');
        mkdirSync(pluginPath, { recursive: true });
        writeFileSync(join(pluginPath, 'browser.js'), '');

        const result = ilcPluginsPath(testDir);

        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.equal(resolve(testDir, 'ilc-plugin-test/browser.js'));
        expect(result[0]).to.match(/^\/|^[A-Z]:\\/); // Starts with / (Unix) or drive letter (Windows)
    });
});
