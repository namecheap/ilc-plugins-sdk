export interface Route {
    url: string;
    meta: {
        [key: string]: any;
    };
    hostname: string;
    route: string;
}

export interface TransitionContinue {
    type: 'continue';
}

export interface TransitionRedirect {
    type: 'redirect'
    newLocation: string;
    /**
     * HTTP redirect code
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
     */
    code?: 301 | 302 | 303 | 307 | 308;
}

export interface TransitionStopNavigation {
    type: 'stop-navigation';
}
