import CommonPluginManager from './common';

import {
    Context,
    PluginManagerPublicApi,
} from './server.types';

import {
    IlcReportingPlugin,
    TransitionHooksPlugin,
    I18nParamsDetectionPlugin,
} from '../plugins/server.types';

import defaultReportingPlugin from '../plugins/reporting/server';
import defaultTransitionHooksPlugin from '../plugins/transitionHooks/server';
import defaultI18nParamsDetectionPlugin from '../plugins/i18nParamsDetection/server';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super(['reporting', 'transitionHooks', 'i18nParamsDetection'], ...contexts);
    }

    getReportingPlugin() {
        const [reportingPlugin] = this.pluginsByType('reporting');
        return reportingPlugin as IlcReportingPlugin || defaultReportingPlugin;
    }

    getTransitionHooksPlugin() {
        const [transitionHooksPlugin] = this.pluginsByType('transitionHooks');
        return transitionHooksPlugin as TransitionHooksPlugin || defaultTransitionHooksPlugin;
    }

    getI18nParamsDetectionPlugin() {
        const [i18nParamsDetection] = this.pluginsByType('i18nParamsDetection');
        return i18nParamsDetection as I18nParamsDetectionPlugin || defaultI18nParamsDetectionPlugin;
    }
}
