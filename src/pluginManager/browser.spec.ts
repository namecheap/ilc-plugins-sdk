import chai from 'chai';
import assert from 'assert';

import {
    PluginManagerPublicApi,
} from './browser.types';

import PluginManager from './browser';

describe('Typescript usage suite', () => {
    it('should be able to execute a test', () => {
        assert.strictEqual(true, true);
    });
});

describe('PluginManager', () => {
    let pluginManager: PluginManagerPublicApi;

    describe('when trying to get a plugin that is existed', () => {
        const transitionHooksPlugin = {
            default: {
                type: 'transitionHooks',
                property: 'propertyOfTransitionHooksPlugin',
                getTransitionHooks: () => {},
            },
        };

        const enum PluginPaths {
            transitionHooks = 'node_modules/@test/ilc-plugin-transition-hooks',
            cloneOfTransitionHooks = 'node_modules/@test/ilc-plugin-that-is-clone-of-transition-hooks-plugin',
            nonExistentType = 'node_modules/@test/ilc-plugin-with-non-existent-type',
        }

        const plugins = {
            [PluginPaths.transitionHooks]: transitionHooksPlugin,
            [PluginPaths.cloneOfTransitionHooks]: {
                type: 'transitionHooks',
                property: 'propertyOfCloneOfTransitionHooksPlugin',
                getTransitionHooks: () => {},
            },
            [PluginPaths.nonExistentType]: {
                type: 'nonExistentType',
                property: 'propertyOfPluginWithNonExistentType',
                method: () => {},
            },
        };

        function context(pluginPath: PluginPaths) {
            return plugins[pluginPath];
        }

        context.keys = function () {
            return Object.keys(plugins);
        };

        beforeEach(() => {
            pluginManager = new PluginManager(context);
        });

        it('should return transition hooks plugin', () => {
            chai.expect(pluginManager.getTransitionHooksPlugin()).to.be.equals(transitionHooksPlugin.default);
        });
    });

    describe('when trying to get a plugin that is non existent', () => {
        function context() {
            return;
        }

        context.keys = function () {
            return [];
        };

        beforeEach(() => {
            pluginManager = new PluginManager(context);
        });

        it('should return null while getting transition hooks plugin', () => {
            chai.expect(pluginManager.getTransitionHooksPlugin()).to.be.eql(require('../plugins/transitionHooks/browser').default);
        });
    });
});
