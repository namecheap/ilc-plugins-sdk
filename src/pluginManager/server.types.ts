import * as server from '../plugins/server.types';

export * from './common.types';

export interface PluginManagerPublicApi {
    getReportingPlugin(): server.IlcReportingPlugin;
    getTransitionHooksPlugin(): server.TransitionHooksPlugin;
    getI18nParamsDetectionPlugin(): server.I18nParamsDetectionPlugin;
}

export interface Plugins {
    reporting?: server.IlcReportingPlugin;
    transitionHooks?: server.TransitionHooksPlugin;
    i18nParamsDetection?: server.I18nParamsDetectionPlugin;
}
