type ErrorLog = {
    message: string,
    error: {
        type: string,
        origin: string,
        name: string,
        stacktrace: string,
    }
};

export class LogUnexpectedError {

    private errorLog: ErrorLog

    constructor(error: Error) {
        this.errorLog = this.processError(error);
    }

    private processError(err: Error) {
        let errorLog: ErrorLog = {
            message: err.message,
            error: {
                type: 'Infrastructure',
                origin: 'self',
                name: err.name,
                stacktrace: err.stack || ''
            }
        };

        return errorLog;
    }

    public serialize() {
        return this.errorLog;
    }
}
