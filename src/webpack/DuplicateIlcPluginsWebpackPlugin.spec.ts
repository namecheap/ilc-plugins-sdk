import path from 'path';
import { expect } from 'chai';
import { createSandbox, SinonStub, SinonSandbox, match } from 'sinon';
import * as ilcPluginsPathModule from './ilcPluginsPath';

import { DuplicateIlcPluginsWebpackPlugin } from './DuplicateIlcPluginsWebpackPlugin';

describe('DuplicateIlcPluginsWebpackPlugin', () => {
    let sandbox: SinonSandbox;
    let dublicatePluginsPlugin: DuplicateIlcPluginsWebpackPlugin;
    let ilcPluginsPathStub: SinonStub;

    let compilerStub: any;
    let compilationTapStub: SinonStub;

    let compilationStub: any;
    let warningsPushStub: SinonStub;

    beforeEach(() => {
        sandbox = createSandbox();
        ilcPluginsPathStub = sandbox.stub(ilcPluginsPathModule, 'ilcPluginsPath').returns([
            path.resolve(__dirname, './fixture/first-plugin.js')
        ]);

        compilationTapStub = sandbox.stub();
        warningsPushStub = sandbox.stub();

        compilerStub = {
            hooks: {
                thisCompilation: {
                    tap: compilationTapStub,
                },
            },
        };

        compilationStub = {
            warnings: {
                push: warningsPushStub,
            },
        };

        dublicatePluginsPlugin = new DuplicateIlcPluginsWebpackPlugin();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should subscribe on thisCompilation hook', () => {
        dublicatePluginsPlugin.apply(compilerStub);
        expect(compilationTapStub.calledWithExactly('DuplicateIlcPluginsWebpackPlugin', match.func)).to.be.true;
    });

    it('should provide pluginsPath from constructor', () => {
        dublicatePluginsPlugin = new DuplicateIlcPluginsWebpackPlugin('./custom-path/');

        dublicatePluginsPlugin.apply(compilerStub);
        const handler = compilationTapStub.getCall(0).args[1];
        handler(compilationStub);

        expect(ilcPluginsPathStub.calledWithExactly('./custom-path/')).to.be.true;
    });

    it('should push "multiple plugins warning" if type duplicates exists', () => {
        const pluginPath = path.resolve(__dirname, './fixture/first-plugin.js');

        ilcPluginsPathStub.returns([
            pluginPath,
            pluginPath,
        ]);

        dublicatePluginsPlugin.apply(compilerStub);
        const handler = compilationTapStub.getCall(0).args[1];
        handler(compilationStub);

        expect(warningsPushStub.calledWith(
            match.instanceOf(Error)
              .and(match.has(
                'message',
                `ILC plugins SDK: Plugins at path "${pluginPath}" duplicates "first" plugin type`,
              )
            )
        )).to.be.true;
        
        expect(warningsPushStub.calledWith(
            match.instanceOf(Error)
              .and(match.has(
                'message',
                `ILC plugins SDK: Multiple plugins of type "first" installed.`,
              )
            )
        )).to.be.true;
        
        expect(warningsPushStub.callCount).to.equal(2);
    });

    it('should not push "multiple plugins warning" if type duplicates exists', () => {
        ilcPluginsPathStub.returns([
            path.resolve(__dirname, './fixture/first-plugin.js'),
            path.resolve(__dirname, './fixture/second-plugin.js')
        ]);

        dublicatePluginsPlugin.apply(compilerStub);
        const handler = compilationTapStub.getCall(0).args[1];
        handler(compilationStub);

        expect(warningsPushStub.notCalled).to.be.true;
        expect(warningsPushStub.callCount).to.equal(0);
    });
});
