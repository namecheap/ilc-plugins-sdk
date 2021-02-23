import * as browser from '../plugins/browser.types';

export * from './common.types';

export interface PluginManagerPublicApi {
    getTransitionHooksPlugin(): browser.TransitionHooksPlugin;
}

export interface Plugins {
    transitionHooks?: browser.TransitionHooksPlugin;
}
