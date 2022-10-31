import CommonPluginManager from './common';

import { Plugin } from './common.types';

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

    public getReportingPlugin(): IlcReportingPlugin {
        const reporters = this.pluginsByType('reporting');
        return reporters.length > 0 ? reportingPluginsWrapper(reporters.concat(consoleReportingPlugin)) : consoleReportingPlugin;
    }

    public getTransitionHooksPlugin() {
        const [transitionHooksPlugin] = this.pluginsByType('transitionHooks');
        return transitionHooksPlugin || defaultTransitionHooksPlugin;
    }

    protected pluginsByType(term: 'reporting'): IlcReportingPlugin[];
    protected pluginsByType(term: 'transitionHooks'): TransitionHooksPlugin[];
    protected pluginsByType(type: string): Plugin[] {
        return super.pluginsByType(type);
    }
}
