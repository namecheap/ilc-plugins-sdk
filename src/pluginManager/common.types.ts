export interface Plugin {
    type: string,
};

export interface Context extends Function {
    keys: () => Array<string>,
}
