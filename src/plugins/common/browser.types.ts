type Primitive = bigint | boolean | null | number | string | string | undefined;

type PlainObjectValue =
  | Primitive
  | Primitive[]
  | PlainObject
  | PlainObjectArray;

export declare interface PlainObject {
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

interface IlcRegistryAppsConfig {
    [key: string]: IlcRegistryAppConfig;
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

type IlcSetting = PlainObject;

type IlcSettings = {
    [key: string]: IlcSetting;
}

type IlcSharedLibConfig = string;

interface IlcSharedLibsConfig {
    [key: string]: IlcSharedLibConfig;
}

export declare interface IlcRegistryConfig {
    apps: IlcRegistryAppsConfig,
    routes: IlcRouteConfig[];
    specialRoutes: {
        [key: string]: Omit<IlcRouteConfig, 'route'>;
    },
    settings: IlcSettings;
    sharedLibs: IlcSharedLibsConfig;
}

export declare interface IlcConfig {
    getConfig(): IlcRegistryConfig;
    getConfigForApps(): IlcRegistryAppsConfig;
    getSettings(): IlcSettings;
    getSettingsByKey(key: string): IlcSetting;
    getConfigForSharedLibs(): IlcSharedLibsConfig;
    getConfigForSharedLibsByName(name: string): IlcSharedLibConfig;
}
