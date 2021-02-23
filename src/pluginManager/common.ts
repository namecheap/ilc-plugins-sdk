import {
    Plugin,
    Plugins,
    Context,
} from './common.types';

export default abstract class PluginManager {
    protected plugins: Plugins = {};

    constructor(pluginTypes: Array<string>, ...contexts: Array<Context>) {
        this.init(pluginTypes, ...contexts);
    }

    // TODO: here we should be using common logger, however for it to work properly we need PluginManager...
    // and so we have circular dependency
    protected init(pluginTypes: Array<string>, ...contexts: Array<Context>) {
        contexts.forEach((context) => context.keys().forEach(pluginPath => {
            const module = context(pluginPath);
            const plugin: Plugin = module.default || module;

            if (!pluginTypes.includes(plugin.type)) {
                console.warn(`ILC plugins SDK: Plugin installed at path "${pluginPath}" of type "${plugin.type}" was ignored as it declares unsupported type.`);
                return;
            }

            if (this.plugins[plugin.type] !== undefined) {
                console.warn(`ILC plugins SDK: Plugin installed at path "${pluginPath}" of type "${plugin.type}" was ignored as it duplicates the existing one.`);
                return;
            }

            console.info(`ILC plugins SDK: Enabling plugin "${pluginPath}" of type "${plugin.type}"...`);
            this.plugins[plugin.type] = plugin;
        }));

        if (Object.keys(this.plugins).length === 0) {
            console.info(`ILC plugins SDK: No plugins were detected.`);
        }
    }
};
