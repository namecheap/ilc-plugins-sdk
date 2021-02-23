import {
    Route,
    TransitionContinue,
    TransitionRedirect,
    TransitionStopNavigation,
} from './common.types';

import {
    Plugin,
} from '../../pluginManager/browser.types';

export type TransitionResult = TransitionContinue | TransitionRedirect | TransitionStopNavigation

export interface Transition {
    route: Route,
    navigate: (url: string) => void,
}

export type TransitionHook = (transition: Transition) => TransitionResult

export declare interface TransitionHooksPlugin extends Plugin {
    type: 'transitionHooks',
    getTransitionHooks: () => Array<TransitionHook>
}
