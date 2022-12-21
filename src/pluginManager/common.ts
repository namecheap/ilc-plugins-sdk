import {
    Plugin,
    Context,
} from './common.types';

function isContext(value: unknown): value is Context {
   return typeof value === 'function' && typeof (value as any).keys === 'function';
}

export default abstract class PluginManager {
    protected plugins: Plugin[] = [];

    constructor(private pluginTypes: string[], ...plugins: Plugin[] | Context[]) {
        this.init(...plugins);
    }

    // TODO: here we should be using common logger, however for it to work properly we need PluginManager...
    // and so we have circular dependency
    protected init(...values: Plugin[] | Context[]) {
        values.forEach((value: Plugin | Context) => {
            if (isContext(value)) {
                value.keys().forEach((pluginPath) => {
                    const module = value(pluginPath);
                    const plugin: Plugin = module.default || module;

                    this.registerPlugin(plugin);
                });
            }

            this.registerPlugin(value as Plugin);
        });

        if (this.plugins.length === 0) {
            console.info(`ILC plugins SDK: No plugins were detected.`);
        }
    }

    protected pluginsByType(type: string): Plugin[] {
        return this.plugins.filter((plugin) => plugin.type === type);
    }

    private registerPlugin(plugin: Plugin) {
        if (!this.pluginTypes.includes(plugin.type)) {
            console.warn(`ILC plugins SDK: Unsupported type "${plugin.type}" plugin was ignored.`);
            return;
        }

        if (this.pluginsByType(plugin.type).length > 0) {
            console.warn(`ILC plugins SDK: Multiple plugins of type "${plugin.type}" installed.`);
        }

        console.info(`ILC plugins SDK: Enabling "${plugin.type}" plugin ...`);
        this.plugins.push(plugin);
    }
};
