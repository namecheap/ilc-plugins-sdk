import {
    Plugin,
} from '../../pluginManager/browser.types';

import { IlcConfig, PlainObject } from '../common/browser.types';

export interface IlcError extends Error {
    code: string;
    errorId: string;
    data: PlainObject;
}

export type LogInfo = PlainObject | IlcError | Error;

export interface Logger {
    warn(msg: string, logInfo?: LogInfo): void;
    info(msg: string, logInfo?: LogInfo): void;
    debug(msg: string, logInfo?: LogInfo): void;
    trace(msg: string, logInfo?: LogInfo): void;
    fatal(msg: string, logInfo?: LogInfo): void;
    error(msg: string, logInfo?: LogInfo): void;
}

export declare interface ReportingPlugin extends Plugin {
    type: 'reporting';
    logger: Logger;
    setConfig: (config: IlcConfig) => void;
}
