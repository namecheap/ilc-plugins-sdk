export interface Route {
    url: string;
    meta: {
        [key: string]: any,
    };
    hostname: string;
}

export interface TransitionContinue {
    type: 'continue';
}

export interface TransitionRedirect {
    type: 'redirect';
    newLocation: string;
}

export interface TransitionStopNavigation {
    type: 'stop-navigation';
}
