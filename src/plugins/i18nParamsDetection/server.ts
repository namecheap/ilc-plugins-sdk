import http from 'http';

import {
    I18n,
    I18nConfig,
    I18nParamsDetectionPlugin,
} from './server.types';

const detectI18nConfig = async (req: http.IncomingMessage, Intl: I18n, storedConfig: I18nConfig, storedConfigFromCookie?: I18nConfig): Promise<I18nConfig> => {
    const currI18nConf = {...storedConfig};

    if (storedConfigFromCookie === undefined && req.url !== undefined) {
        const routeLocale = Intl.parseUrl(req.url);
        currI18nConf.locale = routeLocale.locale;
    }

    return currI18nConf;
};

const plugin: I18nParamsDetectionPlugin = {
    type: 'i18nParamsDetection',
    detectI18nConfig,
};

export default plugin;
