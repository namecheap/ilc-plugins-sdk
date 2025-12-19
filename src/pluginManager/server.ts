import CommonPluginManager from './common';
import { Context, Plugin } from './common.types';

import {
    PluginManagerPublicApi,
} from './server.types';

import {
    IlcReportingPlugin,
    TransitionHooksPlugin,
    I18nParamsDetectionPlugin,
} from '../plugins/server.types';

import { plugin as defaultReportingPlugin } from '../plugins/reporting/server';
import defaultTransitionHooksPlugin from '../plugins/transitionHooks/server';
import defaultI18nParamsDetectionPlugin from '../plugins/i18nParamsDetection/server';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    /**
     * @deprecated use: new PluginManager(...plugins: Plugins[]) instead
     */
    constructor(...plugins: Context[]);
    constructor(...plugins: Plugin[]);
    constructor(...plugins: Context[] | Plugin[]) {
        super(['reporting', 'transitionHooks', 'i18nParamsDetection'], ...plugins);
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
