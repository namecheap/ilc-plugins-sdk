import http from 'http';

import {
    Route,
    TransitionContinue,
    TransitionRedirect,
} from './common.types';

import {
    Logger,
} from '../common/server.types';

import {
    Plugin,
} from '../../pluginManager/server.types';

export type TransitionResult = TransitionContinue | TransitionRedirect

export interface Transition {
    route: Route;
    req: http.IncomingMessage;
    log: Logger,
}

export type TransitionHook = (transition: Transition) => Promise<TransitionResult>

export declare interface TransitionHooksPlugin extends Plugin {
    type: 'transitionHooks';
    getTransitionHooks: () => Array<TransitionHook>;
}
