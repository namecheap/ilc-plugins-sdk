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

import reportingPlugin from '../plugins/reporting/server';
import transitionHooksPlugin from '../plugins/transitionHooks/server';
import i18nParamsDetectionPlugin from '../plugins/i18nParamsDetection/server';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super(['reporting', 'transitionHooks', 'i18nParamsDetection'], ...contexts);
    }

    getReportingPlugin() {
        return this.plugins['reporting'] as IlcReportingPlugin || reportingPlugin;
    }

    getTransitionHooksPlugin() {
        return this.plugins['transitionHooks'] as TransitionHooksPlugin || transitionHooksPlugin;
    }

    getI18nParamsDetectionPlugin() {
        return this.plugins['i18nParamsDetection'] as I18nParamsDetectionPlugin || i18nParamsDetectionPlugin;
    }
}
