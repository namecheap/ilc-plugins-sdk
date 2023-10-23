import path from 'path';
import { ilcPluginsPath } from './ilcPluginsPath';
import type { Resolver, ResolvePluginInstance } from 'webpack';

export default class ResolveIlcDefaultPluginsWebpackPlugin implements ResolvePluginInstance {
    private source = 'resolve';
    private target = 'parsed-resolve';

    constructor(private readonly pluginsPath?: string) {}

    apply(resolver: Resolver) {
        const target = resolver.ensureHook(this.target);

        resolver.getHook(this.source).tapAsync('ResolveIlcDefaultPluginsWebpackPlugin', (request, resolveContext, callback) => {
            let nextRequest = request;

            if (
                nextRequest.request?.endsWith('plugins/transitionHooks/browser') &&
                nextRequest.path &&
                nextRequest.path.endsWith('ilc-plugins-sdk/dist/pluginManager') &&
                nextRequest.context &&
                'issuer' in nextRequest.context &&
                typeof nextRequest.context.issuer === 'string' &&
                nextRequest.context.issuer.endsWith('ilc-plugins-sdk/dist/pluginManager/browser.js')
            ) {
                const pluginPaths = ilcPluginsPath(this.pluginsPath || path.resolve(__dirname, '../../../../node_modules'));

                for (const pluginPath of pluginPaths) {
                    const module = require(pluginPath);
                    const plugin = module.default || module;

                    if (plugin.type === 'transitionHooks') {
                        nextRequest = Object.assign({}, nextRequest, {
                            path: pluginPath,
                            request: '',
                            context: {
                                issuer: null,
                                compiler: undefined,
                            },
                        });

                        if (resolveContext.log) {
                            resolveContext.log(`A default plugin with type "transitionHooks" from "ilc-plugins-sdk" has excluded because a custom plugin installed at "${pluginPath}".`);
                        }

                        break;
                    }
                }
            }

            resolver.doResolve(target, nextRequest, null, resolveContext, callback);
        });
    }
}
