import {
    Plugin,
} from '../../pluginManager/browser.types';

import { IlcConfig, PlainObject } from '../common/browser.types';

export interface IlcError extends Error {
    code: string;
    errorId: string;
    data: PlainObject;
}

export declare type IlcLogInfo = PlainObject | IlcError | Error;

export declare interface IlcLogger {
    warn(msg: string, logInfo?: IlcLogInfo): void;
    info(msg: string, logInfo?: IlcLogInfo): void;
    debug(msg: string, logInfo?: IlcLogInfo): void;
    trace(msg: string, logInfo?: IlcLogInfo): void;
    fatal(msg: string, logInfo?: IlcLogInfo): void;
    error(msg: string, logInfo?: IlcLogInfo): void;
}

export declare interface IlcReportingPlugin extends Plugin {
    type: 'reporting';
    logger: IlcLogger;
    setConfig: (config: IlcConfig) => void;
}
