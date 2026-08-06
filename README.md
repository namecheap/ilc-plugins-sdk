# SDK for ILC plugins development

[![NPM package](https://badgen.net/npm/v/ilc-plugins-sdk?color=red&icon=npm&label=)](https://www.npmjs.com/package/ilc-plugins-sdk)
[![NPM downloads](https://badgen.net/npm/dt/ilc-plugins-sdk)](https://www.npmjs.com/package/ilc-plugins-sdk)

SDK intended for use by developers that build plugins for [Isomorphic Layout Composer](https://github.com/namecheap/ilc).


## Installation

```bash
$ npm i ilc-plugins-sdk
```

## Plugins naming convention

In order to be discoverable by ILC plugin manager - NPM package that contains plugin should be named in one of the following ways:
* `ilc-plugin-*` Example: `ilc-plugin-myreporting`
* `@*/ilc-plugin-*` Example: `@myorg/ilc-plugin-myreporting`

## Installation of the plugin

In order to use ILC with installed plugins we recommend extending base Docker image in the following way:

```dockerfile
ARG ilc_version=latest
FROM namecheap/ilc:${ilc_version}

RUN npm i ilc-plugin-yourpluginname

# Need to rebuild ILC if your plugin has browser implementation
RUN npm run build
```

## Supported plugin types

### Server side plugins

Plugins of this type should provide single entry point for the server implementation.
It will be detected via `main` property in your `package.json`.

#### Reporting plugin

Should implement `IlcReportingPlugin` interface. Allows customizing logs output of the ILC container and optionally set
custom behaviour for request ID generation & handling.


#### I18n params detection plugin

Should implement `I18nParamsDetectionPlugin` interface.


#### Experiments ruleset plugin

Should implement `ExperimentsRulesetPlugin` interface. Supplies the A/B experiment ruleset that ILC
evaluates, so a deployment may take experiment definitions from a source of its own instead of ILC
configuration.

`getRuleset()` is called while a request is being resolved and is synchronous, so it must answer from
memory and never perform I/O. A plugin backed by a remote source is expected to keep its in-memory
copy fresh out-of-band (polling or SSE) and serve every call from that copy.

When no plugin of this type is installed the default supplies an empty ruleset, so ILC keeps using
its own ruleset source exactly as it did before this plugin type existed.

### Isomorphic plugins

Plugins of this type should provide 2 entry points, for the server & browser side respectively.
Server side entrypoint will be detected via `main` property in your `package.json`. While entrypoint
for a browser side implementation expected to be in `browser.js` file in the root folder of NPM package.

Same approach should be used to fetch necessary interfaces for the server & browser side implementation:

Server side:
```typescript
import { TransitionHooksPlugin } from 'ilc-plugins-sdk';
```

Browser side:
```typescript
import { TransitionHooksPlugin } from 'ilc-plugins-sdk/browser';
```

#### Transition hooks plugin

Allows to set up route change hooks which may:
- Prevent routing & display some UI.
- Perform the redirect to another page.
- Allow route change.

Should implement `TransitionHooksPlugin` interface for the browser & server side.
