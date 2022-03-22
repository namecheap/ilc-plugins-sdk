type NonLimitPrimitive = string | number | boolean;
type Primitive = NonLimitPrimitive | object;
type PrimitiveWithDepthLimit = NonLimitPrimitive | {[key in string]: NonLimitPrimitive};
type PrimitiveWithDepthLimit2 = PrimitiveWithDepthLimit | {[key in string]: PrimitiveWithDepthLimit};
type Input = Record<string, Primitive>;
type Output =  Record<string, PrimitiveWithDepthLimit2>;

export class LogEntryFields {
    private readonly maxLength = 10;
    private readonly maxDepth = 2;

    private readonly fields: Output;
    private readonly ignored: string[];
    private readonly detailsJson?: string;


    constructor(fieldsEntry: Input) {
        const { fieldsEntryMaxLength, ignoredKeys } = this.cutObjectToMaxLength(fieldsEntry);

        this.fields = fieldsEntryMaxLength;
        this.ignored = ignoredKeys;

        if(this.ignored.length > 0) {
            this.detailsJson = JSON.stringify(fieldsEntry);
        }
    }

    private cutObjectToMaxLength(fieldsEntry: Input): { fieldsEntryMaxLength: Output, ignoredKeys: string[] } {
        const keys = Object.keys(fieldsEntry);

        const { include, exclude } = this.splitArrayByMaxLength(keys);

        const fieldsEntryMaxLength = include.reduce((acc: Output, key) => {
            const secondLevelValue = fieldsEntry[key];
            acc[key] = this.zipByDepth(secondLevelValue);
            return acc;
        }, {});

        return {
            fieldsEntryMaxLength,
            ignoredKeys: exclude,
        }
    }

    private zipByDepth(entry: Primitive): PrimitiveWithDepthLimit {
        if(typeof entry === 'object') {
            return Object.entries(entry).reduce((acc: object, [key, value]) => {

                return { [key]: typeof value === 'object' ? JSON.stringify(value) : value };
            }, {});
        }

        return entry;
    }

    private splitArrayByMaxLength(array: string[]) {

        const include = array.slice(0, this.maxLength);
        const exclude = array.slice(this.maxLength);

        return {
            include,
            exclude
        }
    }

    public serialize() {
        let fields: object = {
            ...this.fields,
        }

        if(this.ignored.length) {
            fields = {
                ...fields,
                __ignored: this.ignored,
            }

            return {
                fields,
                detailsJson: this.detailsJson,
            }
        }

        return {
            fields,
        }
    }
}
