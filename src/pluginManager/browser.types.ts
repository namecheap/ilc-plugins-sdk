import * as browser from '../plugins/browser.types';
export * from './common.types';

export interface PluginManagerPublicApi {
    getTransitionHooksPlugin(): browser.TransitionHooksPlugin;
    getReportingPlugin(): browser.IlcReportingPlugin;
}

export interface Plugins {
    transitionHooks?: browser.TransitionHooksPlugin;
    reporting?: browser.IlcReportingPlugin;
}
