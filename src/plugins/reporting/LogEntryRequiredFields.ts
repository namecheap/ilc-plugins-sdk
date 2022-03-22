import os from "os";

export class LogEntryRequiredFields {
    private readonly dateTime: string

    private readonly traceId = '11111111111111111111111111111111';

    private readonly operationId = '1111111111111111';

    private readonly serviceName = 'ILC';

    private readonly version: string;

    private hostName: string = os.hostname();

    private logVersion = 'v1';

    private audit = false;

    constructor({ version }: { version: string }) {
        this.dateTime = (new Date()).toISOString();
        this.version = version;
    }

    public serialize() {
        return {
            dateTime: this.dateTime,
            traceId: this.traceId,
            operationId: this.operationId,
            serviceName: this.serviceName,
            version: this.version,
            hostName: this.hostName,
            logVersion: this.logVersion,
        }
    }
}
