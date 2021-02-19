import * as server from '../plugins/server.types';

export * from './common.types';

export const enum PluginTypes {
    reporting = 'reporting',
    transitionHooks = 'transitionHooks',
    i18nParamsDetection = 'i18nParamsDetection',
}

export interface PluginManagerPublicApi {
    getReportingPlugin(): server.IlcReportingPlugin;
    getTransitionHooksPlugin(): server.TransitionHooksPlugin;
    getI18nParamsDetectionPlugin(): server.I18nParamsDetectionPlugin;
}

export interface Plugins {
    [PluginTypes.reporting]?: server.IlcReportingPlugin;
    [PluginTypes.transitionHooks]?: server.TransitionHooksPlugin;
    [PluginTypes.i18nParamsDetection]?: server.I18nParamsDetectionPlugin;
}
