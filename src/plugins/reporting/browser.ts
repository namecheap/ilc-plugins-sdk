import { IlcReportingPlugin, IlcLogInfo, IlcError } from './browser.types';

type ConsoleLogMethods = keyof Pick<Console, 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'log'>;

function isIlcError(error: IlcLogInfo): error is IlcError {
    const maybeIlcError = error as IlcError;
    return maybeIlcError.errorId !== undefined && maybeIlcError.code !== undefined;
}

function isError(error: IlcLogInfo): error is Error {
    const maybeError = error as Error;
    return maybeError.name !== undefined && maybeError.message !== undefined;
}

function logMethod(methodName: ConsoleLogMethods) {
    return (...args: [string, IlcLogInfo]) => {
        const [msg, logInfo] = args;
        const errorInfo = {};
       
        if (logInfo) {        
            if (isError(logInfo)) {
                Object.assign(errorInfo, {
                    type: logInfo.name,
                    message: logInfo.message,
                    stack: (logInfo.stack || '').split('\n'),
                });
            }

            if (isIlcError(logInfo)) {
                Object.assign(errorInfo, {
                    additionalInfo: {
                        ...logInfo.data,
                        code: logInfo.code,
                        errorId: logInfo.errorId,
                    },
                });
            }
        }

        if (Object.keys(errorInfo).length !== 0) {
            console[methodName](msg, JSON.stringify(errorInfo), logInfo);
        } else {
            console[methodName](...args);
        }
    };
}

export const consoleReportingPlugin: IlcReportingPlugin = {
    type: 'reporting',
    logger: {
        warn: logMethod('warn'),
        info: logMethod('info'),
        fatal: logMethod('error'), 
        error: logMethod('error'),
        debug: logMethod('debug'),
        trace: logMethod('trace'),
    },
    setConfig() {},
};

export const reportingPluginsWrapper = (reporters: IlcReportingPlugin[]): IlcReportingPlugin => {
    return  {
        type: 'reporting',
        logger: {
            warn: (...args) => {
                reporters.forEach(reporter => reporter.logger.warn(...args));
            },
            info: (...args) => {
                reporters.forEach(reporter => reporter.logger.info(...args));
            },
            fatal: (...args) => {
                reporters.forEach(reporter => reporter.logger.fatal(...args));
            },
            error: (...args) => {
                reporters.forEach(reporter => reporter.logger.error(...args));
            },
            debug: (...args) => {
                reporters.forEach(reporter => reporter.logger.debug(...args));
            },
            trace: (...args) => {
                reporters.forEach(reporter => reporter.logger.trace(...args));
            },
        },
        setConfig: (...args) => reporters.forEach((reporter) => reporter.setConfig(...args)),
    };
};
