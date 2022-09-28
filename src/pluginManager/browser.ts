import CommonPluginManager from './common';

import {
    Context,
    PluginManagerPublicApi,
} from './browser.types';

import {
    TransitionHooksPlugin,
    TransformErrorPlugin,
} from '../plugins/browser.types';

import transitionHooksPlugin from '../plugins/transitionHooks/browser';
import transformErrorPlugin from '../plugins/transformError/browser';

export default class PluginManager extends CommonPluginManager implements PluginManagerPublicApi {
    constructor(...contexts: Array<Context>) {
        super(['transitionHooks', 'transformError'], ...contexts);
    }

    getTransitionHooksPlugin() {
        return this.plugins['transitionHooks'] as TransitionHooksPlugin || transitionHooksPlugin;
    }

    getTransformErrorPlugin() {
        return this.plugins['transformError'] as TransformErrorPlugin || transformErrorPlugin;    
    }
}
