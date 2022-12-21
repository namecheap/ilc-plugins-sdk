import { expect } from 'chai';
import assert from 'assert';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import {
    PluginManagerPublicApi,
} from './browser.types';

import { Plugin } from './common.types';

import PluginManager from './browser';

import * as reporting from '../plugins/reporting/browser';

describe('Typescript usage suite', () => {
    it('should be able to execute a test', () => {
        assert.strictEqual(true, true);
    });
});

describe('PluginManager', () => {
    let pluginManager: PluginManagerPublicApi;
  
    describe('when trying to get a plugin that is existed', () => {
        let sandbox: SinonSandbox;
        let wrappedReportingPlugin: SinonStub;
        let reportingPluginsWrapperStub: SinonStub;
     
        const transitionHooksPlugin = {
            type: 'transitionHooks',
            property: 'propertyOfTransitionHooksPlugin',
            getTransitionHooks: () => {},
        };

        const cloneOfTransitionHooks = {
            type: 'transitionHooks',
            property: 'propertyOfCloneOfTransitionHooksPlugin',
            getTransitionHooks: () => {},
        };

        const reportingPlugin = {
            type: 'reporting',
            logger: {},
            setConfig: () => {},
        };

        const reportingSecondPlugin = {
            type: 'reporting',
            logger: {},
            setConfig: () => {},
        };

        const nonExistentTypePlugin = {
            type: 'nonExistentType',
            property: 'propertyOfPluginWithNonExistentType',
            method: () => {},
        };

        const enum PluginPaths {
            reporting = 'node_modules/@test/ilc-plugin-reporting-hooks',
            reportingSecond = 'node_modules/@test/ilc-plugin-reporting-second-plugin',
            transitionHooks = 'node_modules/@test/ilc-plugin-transition-hooks',
            cloneOfTransitionHooks = 'node_modules/@test/ilc-plugin-that-is-clone-of-transition-hooks-plugin',
            nonExistentType = 'node_modules/@test/ilc-plugin-with-non-existent-type',
        }

        const plugins = {
            [PluginPaths.reporting]: { default: reportingPlugin },
            [PluginPaths.reportingSecond]: { default: reportingSecondPlugin },
            [PluginPaths.transitionHooks]: { default: transitionHooksPlugin },
            [PluginPaths.cloneOfTransitionHooks]: cloneOfTransitionHooks,
            [PluginPaths.nonExistentType]: nonExistentTypePlugin,
        };

        const pluginsList: Plugin[] = [
            reportingPlugin,
            reportingSecondPlugin,
            transitionHooksPlugin,
            cloneOfTransitionHooks,
            nonExistentTypePlugin,
        ];

        beforeEach(() => {
            sandbox = createSandbox();
    
            wrappedReportingPlugin = sandbox.stub();

            reportingPluginsWrapperStub = sandbox.stub(reporting, 'reportingPluginsWrapper');
            reportingPluginsWrapperStub.returns(wrappedReportingPlugin);
        });

        afterEach(() => sandbox.restore());

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

            it('should return transition hooks plugin', () => {
                expect(pluginManager.getTransitionHooksPlugin()).to.be.equals(transitionHooksPlugin);
            });

            it('should return reporting wrapper plugin', () => {
                expect(pluginManager.getReportingPlugin()).to.be.equals(wrappedReportingPlugin);
            });

            it('should wrap reporting plugins and default console plugin with reportingPluginsWrapper', () => {
                pluginManager.getReportingPlugin();

                expect(reportingPluginsWrapperStub.calledOnceWithExactly([
                    reportingPlugin,
                    reportingSecondPlugin,
                    reporting.consoleReportingPlugin,
                ])).to.be.true;
            });
        });

        describe('from plugins', () => {
            beforeEach(() => {
                pluginManager = new PluginManager(...pluginsList);
            });

            it('should return transition hooks plugin', () => {
                expect(pluginManager.getTransitionHooksPlugin()).to.be.equals(transitionHooksPlugin);
            });

            it('should return reporting wrapper plugin', () => {
                expect(pluginManager.getReportingPlugin()).to.be.equals(wrappedReportingPlugin);
            });

            it('should wrap reporting plugins and default console plugin with reportingPluginsWrapper', () => {
                pluginManager.getReportingPlugin();

                expect(reportingPluginsWrapperStub.calledOnceWithExactly([
                    reportingPlugin,
                    reportingSecondPlugin,
                    reporting.consoleReportingPlugin,
                ])).to.be.true;
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

            it('should return null while getting transition hooks plugin', () => {
                expect(pluginManager.getTransitionHooksPlugin()).to.be.eql(require('../plugins/transitionHooks/browser').default);
            });

            it('should return reporting consoleReporting plugin', () => {
                expect(pluginManager.getReportingPlugin()).to.be.equals(reporting.consoleReportingPlugin);
            });
        });

        describe('from plugins', () => {
            beforeEach(() => {
                pluginManager = new PluginManager(...[] as Plugin[]);
            });

            it('should return null while getting transition hooks plugin', () => {
                expect(pluginManager.getTransitionHooksPlugin()).to.be.eql(require('../plugins/transitionHooks/browser').default);
            });

            it('should return reporting consoleReporting plugin', () => {
                expect(pluginManager.getReportingPlugin()).to.be.equals(reporting.consoleReportingPlugin);
            });
        });
    });
});
