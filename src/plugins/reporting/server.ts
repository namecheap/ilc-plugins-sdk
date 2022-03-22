import pino from 'pino';

import {
    PassThrough,
} from 'stream';

import {
    IlcError,
    IlcReportingPlugin,
} from './server.types';

import { LogEntryRequiredFields } from './LogEntryRequiredFields';
import { LogEntryFields } from './LogEntryFields';
import { LogError } from "./LogError";

// Since process is starting by npm start npm_package_version env var is available
const version = process.env.npm_package_version;
const logItemRequiredFields = new LogEntryRequiredFields({
    version: version || '0.0.0',
});


// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpHeaders = require('http-headers');

const pinoConf: pino.LoggerOptions = {
    level: 'info',
    messageKey: 'message',
    base: logItemRequiredFields.serialize(),
    hooks: {
        logMethod(inputArgs, method) {

            if (inputArgs[0] instanceof Error) {
                const err = inputArgs[0];
                const errorLog = new LogError(err as IlcError);

                inputArgs[0] = errorLog.serialize();

            } else if(typeof inputArgs[0] === 'object' && inputArgs[0] !== null) {
                const logEntry = new LogEntryFields(inputArgs[0]);
                inputArgs[0] = logEntry.serialize();
            }

            return method.apply(this, inputArgs as any);
        }
    },
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
