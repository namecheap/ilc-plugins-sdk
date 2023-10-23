import pino from 'pino';

import {
    PassThrough,
} from 'stream';

import {
    IlcError,
    IlcReportingPlugin,
} from './server.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpHeaders = require('http-headers');

const pinoConf: pino.LoggerOptions = {
    level: 'info',
    // nestedKey: 'payload', TODO: blocked by https://github.com/pinojs/pino/issues/883
    hooks: {
        logMethod(inputArgs: any[], method) {
            if (inputArgs[0] instanceof Error) {
                const err = inputArgs[0] as IlcError;

                const causeData = [];
                let rawErr = err.cause as IlcError;
                while (rawErr) {
                    if (rawErr.data) {
                        causeData.push(rawErr.data);
                    } else {
                        causeData.push({});
                    }
                    rawErr = rawErr.cause as IlcError;
                }

                const logObj: {
                    type: string,
                    message: string,
                    stack?: Array<string>,
                    additionalInfo?: {
                        [key: string]: any,
                    },
                    causeData?: Array<{
                        [key: string]: any,
                    }>,
                } = {
                    type: err.name,
                    message: err.message,
                    stack: err.stack?.split("\n"),
                };

                if (err.data) {
                    logObj.additionalInfo = err.data;
                }

                if (causeData.length) {
                    logObj.causeData = causeData;
                }

                inputArgs[0] = logObj;
            }

            return method.apply(this, inputArgs as Parameters<pino.LogFn>);
        }
    },
    serializers: {
        res(res) {
            const r = {
                statusCode: res.statusCode,
                headers: {},
            };

            if (r.statusCode >= 300 && r.statusCode < 400) {
                const headers = httpHeaders(res, true);
                if (headers['location']) {
                    r.headers = {
                        location: headers['location']
                    };
                }
            }

            return r;
        }
    }
};

const plugin: IlcReportingPlugin = {
    type: 'reporting',
    /**
     * We need this to being able to capture stdout of the app
     * As for pure "process.stdout" uses faster logs output via sonic-boom which is hard to intercept
     */
    logger: pino(pinoConf, process.env.NODE_ENV === 'test' ? new PassThrough().pipe(process.stdout) : process.stdout),
    requestIdLogLabel: 'operationId',
    genReqId: require('hyperid')({urlSafe: true, fixedLength: true}),
};

export default plugin;
