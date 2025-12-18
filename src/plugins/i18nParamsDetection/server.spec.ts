import chai from 'chai';
import http from 'http';

import plugin from './server';
import { I18n, I18nConfig } from './server.types';

describe('i18nParamsDetection plugin', () => {
    const mockI18n: I18n = {
        localizeUrl: (url: string) => url,
        parseUrl: (url: string) => ({
            locale: 'en-US',
            cleanUrl: url,
        }),
        getCanonicalLocale: (locale: string) => locale,
        getSupportedLocales: async () => ['en-US', 'es-ES'],
        getDefaultLocale: async () => 'en-US',
        getSupportedCurrencies: async () => ['USD', 'EUR'],
        getDefaultCurrency: async () => 'USD',
    };

    const storedConfig: I18nConfig = {
        locale: 'es-ES',
        currency: 'EUR',
    };

    it('should have correct plugin type', () => {
        chai.expect(plugin.type).to.equal('i18nParamsDetection');
    });

    it('should return storedConfig when storedConfigFromCookie is provided', async () => {
        const req = {
            url: '/test/path',
            headers: {},
        } as http.IncomingMessage;

        const storedConfigFromCookie: I18nConfig = {
            locale: 'fr-FR',
            currency: 'EUR',
        };

        const result = await plugin.detectI18nConfig(req, mockI18n, storedConfig, storedConfigFromCookie);

        chai.expect(result).to.deep.equal(storedConfig);
    });

    it('should parse URL and update locale when storedConfigFromCookie is undefined', async () => {
        const req = {
            url: '/test/path',
            headers: {},
        } as http.IncomingMessage;

        const result = await plugin.detectI18nConfig(req, mockI18n, storedConfig);

        chai.expect(result.locale).to.equal('en-US');
        chai.expect(result.currency).to.equal(storedConfig.currency);
    });

    it('should return storedConfig when storedConfigFromCookie is undefined and req.url is undefined', async () => {
        const req = {
            headers: {},
        } as http.IncomingMessage;

        const result = await plugin.detectI18nConfig(req, mockI18n, storedConfig);

        chai.expect(result).to.deep.equal(storedConfig);
    });

    it('should preserve currency from storedConfig when updating locale', async () => {
        const req = {
            url: '/some/localized/path',
            headers: {},
        } as http.IncomingMessage;

        const customStoredConfig: I18nConfig = {
            locale: 'ja-JP',
            currency: 'JPY',
        };

        const result = await plugin.detectI18nConfig(req, mockI18n, customStoredConfig);

        chai.expect(result.locale).to.equal('en-US');
        chai.expect(result.currency).to.equal('JPY');
    });
});
