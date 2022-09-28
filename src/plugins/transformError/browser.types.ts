
import {
    Plugin,
} from '../../pluginManager/browser.types';

import {
    PlainObject,
    IlcRegistryConfig
} from './common.types';

interface ErrorInfo extends PlainObject {
    location?: {
        colNo?: number;
        lineNo?: number;
        fileName?: string;
    };
    src?: string;
    type: string;
    name?: string;
    errorId: string;
    appName?: string;
    slotName?: string;
    dependants?: string[];
}

export { ErrorInfo, IlcRegistryConfig };

export interface TransformErrorResult {
    error: Error,
    errorInfo: ErrorInfo,
}

export interface TransformErrorParams {
    config: IlcRegistryConfig,
    error: Error,
    errorInfo: ErrorInfo,
}

export type TransformError = (transition: TransformErrorParams) => TransformErrorResult

export declare interface TransformErrorPlugin extends Plugin {
    type: 'errorTransform',
    transform: TransformError;
}
