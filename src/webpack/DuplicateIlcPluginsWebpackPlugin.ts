import path from 'path';
import { ilcPluginsPath } from './ilcPluginsPath';
import { WebpackError, type Compiler, type WebpackPluginInstance } from 'webpack';

function createDuplicateError(message: string): WebpackError {
    const error = new WebpackError(message);
    error.name = 'DuplicateIlcPluginsWebpackPlugin';

    return error;
}

export class DuplicateIlcPluginsWebpackPlugin implements WebpackPluginInstance {
    constructor(private readonly pluginsPath?: string) {}

	apply(compiler: Compiler) {
        compiler.hooks.thisCompilation.tap('DuplicateIlcPluginsWebpackPlugin', (compilation) => {
            const pluginPaths = ilcPluginsPath(this.pluginsPath || path.resolve(__dirname, '../../../../node_modules'));
            const pluginTypeCount: Record<string, number> = {};

            for (const pluginPath of pluginPaths) {
                const module = require(pluginPath);
                const plugin = module.default || module;

                pluginTypeCount[plugin.type] = (pluginTypeCount[plugin.type] || 0) + 1;

                if (pluginTypeCount[plugin.type] > 1) {
                    compilation.warnings.push(createDuplicateError(`ILC plugins SDK: Plugins at path "${pluginPath}" duplicates "${plugin.type}" plugin type`));
                }
            }

            for (const pluginType in pluginTypeCount) {
                if (pluginTypeCount[pluginType] > 1) {
                    compilation.warnings.push(createDuplicateError(`ILC plugins SDK: Multiple plugins of type "${pluginType}" installed.`));
                }
            }
        });
    }
}