import CommonPluginManager from './common';

import {
    Context,
    PluginTypes,
    PluginManagerPublicApi,
} from './server.types';

import {
    IlcReportingPlugin,
    TransitionHooksPlugin,
    I18nParamsDetectionPlugin,
} from '../plugins/server.types';

import reportingPlugin from '../plugins/reporting/server';
import transitionHooksPlugin from '../plugins/transitionHooks/server';
import i18nParamsDetectionPlugin from '../plugins/i18nParamsDetection/server';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super([PluginTypes.reporting, PluginTypes.transitionHooks, PluginTypes.i18nParamsDetection], ...contexts);
    }

    getReportingPlugin() {
        return this.plugins[PluginTypes.reporting] as IlcReportingPlugin || reportingPlugin;
    }

    getTransitionHooksPlugin() {
        return this.plugins[PluginTypes.transitionHooks] as TransitionHooksPlugin || transitionHooksPlugin;
    }

    getI18nParamsDetectionPlugin() {
        return this.plugins[PluginTypes.i18nParamsDetection] as I18nParamsDetectionPlugin || i18nParamsDetectionPlugin;
    }
}
