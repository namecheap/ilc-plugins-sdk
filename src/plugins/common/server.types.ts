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
