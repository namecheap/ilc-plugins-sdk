import {
    Plugin,
    Context,
} from './common.types';

export default abstract class PluginManager {
    protected plugins: Plugin[] = [];

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
                console.warn(`ILC plugins SDK: Unsupported type "${plugin.type}" plugin was ignored.`);
                return;
            }

            if (this.pluginsByType(plugin.type).length > 0) {
                console.warn(`ILC plugins SDK: Multiple plugins of type "${plugin.type}" installed.`);
            }

            console.info(`ILC plugins SDK: Enabling "${plugin.type}" plugin ...`);
            this.plugins.push(plugin);
        }));

        if (this.plugins.length === 0) {
            console.info(`ILC plugins SDK: No plugins were detected.`);
        }
    }

    protected pluginsByType(type: string): Plugin[] {
        return this.plugins.filter((plugin) => plugin.type === type);
    }
};
