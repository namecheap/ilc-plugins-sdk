export interface ClientRoute {
    url: string;
    meta: object;
}

export interface ClientTransitionContinue {
    type: 'continue';
}

export interface ClientTransitionRedirect {
    type: 'redirect';
    newLocation: string;
}

export interface ClientTransitionStopNavigation {
    type: 'stop-navigation';
}

export type ClientTransitionResult = ClientTransitionContinue | ClientTransitionRedirect | ClientTransitionStopNavigation

export interface ClientTransition {
    route: ClientRoute,
    navigate: (url: string) => void,
}

export type ClientTransitionHook = (transition: ClientTransition) => ClientTransitionResult

export declare interface ClientTransitionHooksPlugin {
    type: 'transitionHooks',
    getTransitionHooks: () => Array<ClientTransitionHook>
}
