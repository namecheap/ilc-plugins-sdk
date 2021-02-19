import * as browser from '../plugins/browser.types';

export * from './common.types';

export const enum PluginTypes {
    transitionHooks = 'transitionHooks',
}

export interface PluginManagerPublicApi {
    getTransitionHooksPlugin(): browser.TransitionHooksPlugin;
}

export interface Plugins {
    [PluginTypes.transitionHooks]?: browser.TransitionHooksPlugin;
}
