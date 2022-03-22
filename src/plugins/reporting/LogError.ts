import { IlcError } from './server.types';
import {LogEntryFields} from "./LogEntryFields";

type ErrorLog = {
    message: string,
    error: {
        type: string,
        origin: string,
        name: string,
        stacktrace: string,
    },
    fields?: object,
    detailsJSON?: string
};

export class LogError {

    private errorLog: ErrorLog

    constructor(error: IlcError) {
        this.errorLog = this.processError(error);
    }

    private processError(err: IlcError) {
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

        let errorLog: ErrorLog = {
            message: err.message,
            error: {
                type: 'Infrastructure',
                origin: 'self',
                name: err.name,
                stacktrace: err.stack || ''
            }
        };

        if (err.data && typeof err.data === 'object') {
            errorLog.fields = new LogEntryFields(err.data);
        }

        if (causeData.length) {
            errorLog.detailsJSON = JSON.stringify(causeData);
        }

        return errorLog;
    }

    public serialize() {
        return this.errorLog;
    }
}
