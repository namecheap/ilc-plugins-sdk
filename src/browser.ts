import {
    Route,
    TransitionContinue,
    TransitionRedirect,
    TransitionStopNavigation,
} from './common';

export type TransitionResult = TransitionContinue | TransitionRedirect | TransitionStopNavigation

export interface Transition {
    route: Route,
    navigate: (url: string) => void,
}

export type TransitionHook = (transition: Transition) => TransitionResult

export declare interface TransitionHooksPlugin {
    type: 'transitionHooks',
    getTransitionHooks: () => Array<TransitionHook>
}
