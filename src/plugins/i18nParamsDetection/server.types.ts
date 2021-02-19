import http from 'http';

import {
    Plugin,
    PluginTypes,
} from '../../pluginManager/server.types';

export interface I18nConfig {
    locale: string;
    currency: string;
}

export interface I18n {
    localizeUrl(url: string, configOverride?: {
        locale?: string;
    }): string;
    parseUrl(url: string): {
        locale: string;
        cleanUrl: string;
    };
    getCanonicalLocale(locale: string): string | null;
}

export declare interface I18nParamsDetectionPlugin extends Plugin {
    type: PluginTypes.i18nParamsDetection;
    detectI18nConfig: (req: http.IncomingMessage, i18n: I18n, storedConfig: I18nConfig, storedConfigFromCookie?: I18nConfig) => Promise<I18nConfig>;
}
