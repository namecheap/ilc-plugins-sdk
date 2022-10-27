import CommonPluginManager from './common';

import {
    Context,
    PluginManagerPublicApi,
} from './browser.types';

import {
    TransitionHooksPlugin,
} from '../plugins/browser.types';

import {
    IlcReportingPlugin,
} from '../plugins/reporting/browser.types';

import { consoleReportingPlugin, reportingPluginsWrapper } from '../plugins/reporting/browser';
import defaultTransitionHooksPlugin from '../plugins/transitionHooks/browser';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super(['transitionHooks', 'reporting'], ...contexts);
    }

    getReportingPlugin(): IlcReportingPlugin {
        const reporters = this.pluginsByType('reporting') as IlcReportingPlugin[];
        return reporters.length > 0 ? reportingPluginsWrapper(reporters.concat(consoleReportingPlugin)) : consoleReportingPlugin;
    }

    getTransitionHooksPlugin() {
        const [transitionHooksPlugin] = this.pluginsByType('transitionHooks');
        return transitionHooksPlugin as TransitionHooksPlugin || defaultTransitionHooksPlugin;
    }
}
