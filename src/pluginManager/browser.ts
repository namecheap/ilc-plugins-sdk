import CommonPluginManager from './common';

import {
    Context,
    PluginTypes,
    PluginManagerPublicApi,
} from './browser.types';

import {
    TransitionHooksPlugin,
} from '../plugins/browser.types';

import transitionHooksPlugin from '../plugins/transitionHooks/browser';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super([PluginTypes.transitionHooks], ...contexts);
    }

    getTransitionHooksPlugin() {
        return this.plugins[PluginTypes.transitionHooks] as TransitionHooksPlugin || transitionHooksPlugin;
    }
}
