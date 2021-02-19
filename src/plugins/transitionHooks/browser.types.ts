import {
    Route,
    TransitionContinue,
    TransitionRedirect,
    TransitionStopNavigation,
} from './common.types';

import {
    Plugin,
    PluginTypes,
} from '../../pluginManager/browser.types';

export type TransitionResult = TransitionContinue | TransitionRedirect | TransitionStopNavigation

export interface Transition {
    route: Route,
    navigate: (url: string) => void,
}

export type TransitionHook = (transition: Transition) => TransitionResult

export declare interface TransitionHooksPlugin extends Plugin {
    type: PluginTypes.transitionHooks,
    getTransitionHooks: () => Array<TransitionHook>
}
