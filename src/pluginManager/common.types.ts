export interface Plugin {
    type: string,
};

export interface Plugins {
    [key: string]: Plugin | undefined,
}

export interface Context extends Function {
    keys: () => Array<string>,
}
