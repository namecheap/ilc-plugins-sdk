import {
    TransitionHooksPlugin,
} from './browser.types';

export const cookieName = 'ilc-plugin-transition-hooks-sample';

const plugin: TransitionHooksPlugin = {
    type: 'transitionHooks',
    getTransitionHooks: () => [
        ({
            route,
            navigate,
        }) => {
            console.log('Browser transition hook with index #0 called with meta:', route.meta);

            if (route.meta.protected !== true) {
                return {type: 'continue'};
            }

            if (document.cookie.includes(cookieName)) {
                return {type: 'continue'};
            }

            const dialog = document.createElement('dialog');

            dialog.innerHTML =
                'Are you sure you want to proceed? This will add cookie to remember your choice...' + '<br/>' +
                '<form method="dialog">' +
                    '<button value="no">Cancel</button>' +
                    '<button id="confirmBtn" value="yes">Confirm</button>' +
                '</form>';

            document.body.appendChild(dialog);

            dialog.addEventListener('close', function () {
                if (dialog.returnValue === 'yes') {
                    document.cookie = `${cookieName}=skip; path=/;`;
                    navigate(route.url);
                }

                dialog.remove();
            });

            dialog.showModal();

            return {type: 'stop-navigation'};
        },
    ],
};

export default plugin;
