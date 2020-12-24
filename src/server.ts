import http from 'http';

export interface Logger {
    fatal(msg: string, ...args: any[]): void;
    fatal(obj: {}, msg?: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
    error(obj: {}, msg?: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    warn(obj: {}, msg?: string, ...args: any[]): void;
    info(msg: string, ...args: any[]): void;
    info(obj: {}, msg?: string, ...args: any[]): void;
    debug(msg: string, ...args: any[]): void;
    debug(obj: {}, msg?: string, ...args: any[]): void;
    trace(msg: string, ...args: any[]): void;
    trace(obj: {}, msg?: string, ...args: any[]): void;
}

export declare class IlcError implements Error {
    public name: string;
    public message: string;
    public stack?: string;

    public cause?: IlcError;
    public data?: any;

    constructor(message?: string);
}

export declare interface IlcReportingPlugin {
    type: 'reporting';
    logger: Logger;
    requestIdLogLabel?: string;
    genReqId?: () => string;
}

export interface I18nConfig {
    locale: string;
    currency: string;
}

export interface I18n {
    localizeUrl(url: string, configOverride?: {
        locale?: string;
    }): string;
    parseUrl(config: I18nConfig, url: string): {
        locale: string;
        cleanUrl: string;
    };
    getCanonicalLocale(locale: string): string | null;
}

export declare interface I18nParamsDetectionPlugin {
    type: 'i18nParamsDetection';
    getI18nConfig: (req: http.IncomingMessage, i18n: I18n, config: I18nConfig) => Promise<I18nConfig>;
}
