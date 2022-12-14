import fg from 'fast-glob';
import { expect } from 'chai';
import { createSandbox, SinonStub, SinonSandbox } from 'sinon';
import { ilcPluginsPath } from './ilcPluginsPath';

describe('ilcPluginsPath', () => {
    let fgSyncStub: SinonStub;
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = createSandbox();
        fgSyncStub = sandbox.stub(fg, 'sync').returns(['./some/plugin-path']);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call fg.sync with correct arguments', () => {
        ilcPluginsPath('./some/path');

        expect(fgSyncStub.calledWithExactly(['ilc-plugin-*/browser.js', '@*/ilc-plugin-*/browser.js'], {
            cwd: './some/path',
            absolute: true,
        })).to.be.true;
    });

    it('should return fg.sync results', () => {
        expect(ilcPluginsPath('./some/path')).to.deep.equal(['./some/plugin-path']);
    });
});