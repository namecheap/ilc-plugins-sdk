import chai from 'chai';
import assert from 'assert';

import {
    PluginManagerPublicApi,
} from './server.types';


import { Plugin } from './common.types';

import PluginManager from './server';

describe('Typescript usage suite', () => {
    it('should be able to execute a test', () => {
        assert.strictEqual(true, true);
    });
});

describe('PluginManager', () => {
    let pluginManager: PluginManagerPublicApi;

    describe('when trying to get a plugin that is existed', () => {
        const reportingPlugin = {
            type: 'reporting',
            property: 'propertyOfReportingPlugin',
            method: () => {},
        };

        const cloneOfReporting = {
            type: 'reporting',
            property: 'propertyOfCloneOfReportingPlugin',
            method: () => {},
        };

        const i18nParamsDetectionPlugin = {
            type: 'i18nParamsDetection',
            property: 'propertyOfI18nParamsDetectionPlugin',
            method: () => {},
        };

        const transitionHooksPlugin = {
            type: 'transitionHooks',
            property: 'propertyOfTransitionHooksPlugin',
            method: () => {},
        };

        const nonExistentType = {
            type: 'nonExistentType',
            property: 'propertyOfPluginWithNonExistentType',
            method: () => {},
        };

        const enum PluginPaths {
            reporting = 'node_modules/@test/ilc-plugin-reporting',
            i18nParamsDetection = 'node_modules/@test/ilc-plugin-i18n-params-detection',
            transitionHooks = 'node_modules/@test/ilc-plugin-transition-hooks',
            cloneOfReporting = 'node_modules/@test/ilc-plugin-that-is-clone-of-reporting-plugin',
            nonExistentType = 'node_modules/@test/ilc-plugin-with-non-existent-type',
        }

        const plugins = {
            [PluginPaths.reporting]: reportingPlugin,
            [PluginPaths.i18nParamsDetection]: i18nParamsDetectionPlugin,
            [PluginPaths.transitionHooks]: { default: transitionHooksPlugin },
            [PluginPaths.cloneOfReporting]: cloneOfReporting,
            [PluginPaths.nonExistentType]: nonExistentType,
        };

        const pluginsList: Plugin[] = [
            reportingPlugin,
            i18nParamsDetectionPlugin,
            transitionHooksPlugin,
            cloneOfReporting,
            nonExistentType,
        ];

        describe('from context', () => {
            function context(pluginPath: PluginPaths) {
                return plugins[pluginPath];
            }

            context.keys = function () {
                return Object.keys(plugins);
            };

            beforeEach(() => {
                pluginManager = new PluginManager(context);
            });

            it('should return reporting plugin', () => {
                chai.expect(pluginManager.getReportingPlugin()).to.be.equals(reportingPlugin);
            });

            it('should return i18n params detection plugin', () => {
                chai.expect(pluginManager.getI18nParamsDetectionPlugin()).to.be.equals(i18nParamsDetectionPlugin);
            });

            it('should return transition hooks plugin', () => {
                chai.expect(pluginManager.getTransitionHooksPlugin()).to.be.equals(transitionHooksPlugin);
            });
        });

        describe('from plugins', () => {
            beforeEach(() => {
                pluginManager = new PluginManager(...pluginsList);
            });

            it('should return reporting plugin', () => {
                chai.expect(pluginManager.getReportingPlugin()).to.be.equals(reportingPlugin);
            });

            it('should return i18n params detection plugin', () => {
                chai.expect(pluginManager.getI18nParamsDetectionPlugin()).to.be.equals(i18nParamsDetectionPlugin);
            });

            it('should return transition hooks plugin', () => {
                chai.expect(pluginManager.getTransitionHooksPlugin()).to.be.equals(transitionHooksPlugin);
            });
        });
    });

    describe('when trying to get a plugin that is non existent', () => {

        describe('from context', () => {
            function context() {
                return;
            }

            context.keys = function () {
                return [];
            };

            beforeEach(() => {
                pluginManager = new PluginManager(context);
            });

            it('should return null while getting reporting plugin', () => {
                chai.expect(pluginManager.getReportingPlugin()).to.be.eql(require('../plugins/reporting/server').default);
            });

            it('should return null while getting i18n params detection plugin', () => {
                chai.expect(pluginManager.getI18nParamsDetectionPlugin()).to.be.eql(require('../plugins/i18nParamsDetection/server').default);
            });

            it('should return null while getting transition hooks plugin', () => {
                chai.expect(pluginManager.getTransitionHooksPlugin()).to.be.eql(require('../plugins/transitionHooks/server').default);
            });
        });

        describe('from plugins', () => {
            beforeEach(() => {
                pluginManager = new PluginManager(...[] as Plugin[]);
            });

            it('should return null while getting reporting plugin', () => {
                chai.expect(pluginManager.getReportingPlugin()).to.be.eql(require('../plugins/reporting/server').default);
            });

            it('should return null while getting i18n params detection plugin', () => {
                chai.expect(pluginManager.getI18nParamsDetectionPlugin()).to.be.eql(require('../plugins/i18nParamsDetection/server').default);
            });

            it('should return null while getting transition hooks plugin', () => {
                chai.expect(pluginManager.getTransitionHooksPlugin()).to.be.eql(require('../plugins/transitionHooks/server').default);
            });
        });
    });
});
