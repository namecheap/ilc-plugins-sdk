type Primitive = bigint | boolean | null | number | string | string | undefined;

type PlainObjectValue =
  | Primitive
  | Primitive[]
  | PlainObject
  | PlainObjectArray;

export interface PlainObject {
  [key: string]: PlainObjectValue;
}

interface PlainObjectArray extends Array<PlainObject> {}

interface IlcRegistryAppConfig {
    spaBundle: string;
    cssBundle: string;
    props?: PlainObject;
    kind: string;
    wrappedWith?: string;
    depndencies?: {
        [key: string]: string;
    };
}

interface IlcRouteSlotConfig {
    appName: string;
    props: PlainObject;
    kind: string | null;
}

interface IlcRouteConfig {
    slots: {
        [key: string]: IlcRouteSlotConfig;
    },
    meta: PlainObject;
    route: string;
    next: boolean;
    template: string;
}

export interface IlcRegistryConfig {
    apps: {
        [key: string]: IlcRegistryAppConfig;
    },
    routes: IlcRouteConfig[];
    specialRoutes: {
        [key: string]: Omit<IlcRouteConfig, 'route'>;
    },
    settings: PlainObject;
    sharedLibs: {
        [key: string]: string;
    }
}