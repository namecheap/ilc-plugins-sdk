import {
    Logger,
} from '../common/server.types';

import {
    Plugin,
} from '../../pluginManager/server.types';

export declare class IlcError implements Error {
    public name: string;
    public message: string;
    public stack?: string;

    public cause?: IlcError;
    public data?: any;

    constructor(message?: string);
}

export declare interface IlcReportingPlugin extends Plugin {
    type: 'reporting';
    logger: Logger;
    requestIdLogLabel?: string;
    genReqId?: () => string;
}
