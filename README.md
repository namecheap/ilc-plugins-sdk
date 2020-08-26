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
```

## Supported plugin types

### Reporting plugin

Should implement `IlcReportingPlugin` interface. Allows to customize logs output of the ILC container and optionally set 
custom behaviour for request ID generation & handling.