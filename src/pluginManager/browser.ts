import CommonPluginManager from './common';

import {
    Context,
    PluginManagerPublicApi,
} from './browser.types';

import {
    TransitionHooksPlugin,
} from '../plugins/browser.types';

import transitionHooksPlugin from '../plugins/transitionHooks/browser';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super(['transitionHooks'], ...contexts);
    }

    getTransitionHooksPlugin() {
        return this.plugins['transitionHooks'] as TransitionHooksPlugin || transitionHooksPlugin;
    }
}
