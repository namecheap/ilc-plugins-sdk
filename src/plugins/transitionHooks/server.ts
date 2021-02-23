import {
    TransitionHooksPlugin,
} from './server.types';

import {
    cookieName,
} from './browser';

const plugin: TransitionHooksPlugin = {
    type: 'transitionHooks',
    getTransitionHooks: () => [
        async ({route, req, log}) => {
            log.info(route.meta, 'meta info that was provided when server transition hook with index #0 called');

            if (route.meta.protected !== true) {
                return {type: 'continue'};
            }

            if (req.headers.cookie && req.headers.cookie.includes(cookieName)) {
                return {type: 'continue'};
            }

            return {type: 'redirect', newLocation: '/'};
        },
    ],
};

export default plugin;
