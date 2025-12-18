import chai from 'chai';
import sinon from 'sinon';

import plugin, { cookieName } from './browser';

describe('transitionHooks browser plugin', () => {
    let sandbox: sinon.SinonSandbox;
    let originalDocument: any;
    let consoleLogStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        consoleLogStub = sandbox.stub(console, 'log');

        // Save original document if it exists
        originalDocument = (global as any).document;

        // Create minimal document mock
        (global as any).document = {
            cookie: '',
            body: {
                appendChild: sinon.stub(),
            },
            createElement: sinon.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();

        // Restore original document
        if (originalDocument !== undefined) {
            (global as any).document = originalDocument;
        } else {
            delete (global as any).document;
        }
    });

    it('should have correct plugin type', () => {
        chai.expect(plugin.type).to.equal('transitionHooks');
    });

    it('should export cookieName', () => {
        chai.expect(cookieName).to.equal('ilc-plugin-transition-hooks-sample');
    });

    it('should return an array of hooks from getTransitionHooks', () => {
        const hooks = plugin.getTransitionHooks();
        chai.expect(hooks).to.be.an('array');
        chai.expect(hooks).to.have.lengthOf(1);
        chai.expect(hooks[0]).to.be.a('function');
    });

    describe('transition hook', () => {
        it('should log route meta when hook is called', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: false, customField: 'value' },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: sinon.stub(),
            };

            hook(mockTransition);

            chai.expect(consoleLogStub.calledOnce).to.be.true;
            chai.expect(consoleLogStub.firstCall.args[0]).to.equal('Browser transition hook with index #0 called with meta:');
            chai.expect(consoleLogStub.firstCall.args[1]).to.deep.equal({ protected: false, customField: 'value' });
        });

        it('should return continue when route is not protected', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: false },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: sinon.stub(),
            };

            const result = hook(mockTransition);

            chai.expect(result).to.deep.equal({ type: 'continue' });
            chai.expect(consoleLogStub.calledOnce).to.be.true;
        });

        it('should return continue when protected is not set (undefined)', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const mockTransition = {
                route: {
                    url: '/test',
                    meta: {},
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: sinon.stub(),
            };

            const result = hook(mockTransition);

            chai.expect(result).to.deep.equal({ type: 'continue' });
        });

        it('should return continue when cookie exists for protected route', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const navigateStub = sinon.stub();
            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: true },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: navigateStub,
            };

            // Set document.cookie to include our cookie
            (global as any).document.cookie = `${cookieName}=skip; path=/;`;

            const result = hook(mockTransition);

            chai.expect(result).to.deep.equal({ type: 'continue' });
            // Should not have created a dialog or called navigate
            chai.expect(((global as any).document.createElement as sinon.SinonStub).called).to.be.false;
            chai.expect(navigateStub.called).to.be.false;
        });

        it('should return stop-navigation and create dialog when protected without cookie', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: true },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: sinon.stub(),
            };

            // Set document.cookie to not include our cookie
            (global as any).document.cookie = 'other=value';

            // Mock dialog
            const mockDialog = {
                innerHTML: '',
                addEventListener: sandbox.stub(),
                showModal: sandbox.stub(),
                remove: sandbox.stub(),
                returnValue: '',
            };

            ((global as any).document.createElement as sinon.SinonStub).withArgs('dialog').returns(mockDialog);

            const result = hook(mockTransition);

            chai.expect(result).to.deep.equal({ type: 'stop-navigation' });
            chai.expect(((global as any).document.createElement as sinon.SinonStub).calledOnceWith('dialog')).to.be.true;
            chai.expect(((global as any).document.body.appendChild as sinon.SinonStub).calledOnceWith(mockDialog)).to.be.true;
            chai.expect(mockDialog.showModal.calledOnce).to.be.true;
            chai.expect(mockDialog.addEventListener.calledOnceWith('close', sinon.match.func)).to.be.true;
        });

        it('should set correct dialog innerHTML with confirmation message', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: true },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: sinon.stub(),
            };

            (global as any).document.cookie = 'other=value';

            const mockDialog = {
                innerHTML: '',
                addEventListener: sandbox.stub(),
                showModal: sandbox.stub(),
                remove: sandbox.stub(),
                returnValue: '',
            };

            ((global as any).document.createElement as sinon.SinonStub).withArgs('dialog').returns(mockDialog);

            hook(mockTransition);

            chai.expect(mockDialog.innerHTML).to.include('Are you sure you want to proceed?');
            chai.expect(mockDialog.innerHTML).to.include('This will add cookie to remember your choice');
            chai.expect(mockDialog.innerHTML).to.include('<form method="dialog">');
            chai.expect(mockDialog.innerHTML).to.include('<button value="no">Cancel</button>');
            chai.expect(mockDialog.innerHTML).to.include('<button id="confirmBtn" value="yes">Confirm</button>');
        });

        it('should set cookie and navigate when dialog is confirmed with yes', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const navigateStub = sinon.stub();
            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: true },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: navigateStub,
            };

            // Set initial cookie value
            (global as any).document.cookie = 'other=value';

            // Mock dialog with callback capture
            let closeCallback: Function | null = null;
            const mockDialog = {
                innerHTML: '',
                addEventListener: (event: string, callback: Function) => {
                    if (event === 'close') {
                        closeCallback = callback;
                    }
                },
                showModal: sandbox.stub(),
                remove: sandbox.stub(),
                returnValue: 'yes',
            };

            ((global as any).document.createElement as sinon.SinonStub).withArgs('dialog').returns(mockDialog);

            const result = hook(mockTransition);

            chai.expect(result).to.deep.equal({ type: 'stop-navigation' });
            chai.expect(closeCallback).to.not.be.null;

            // Trigger the close callback
            closeCallback!();

            chai.expect((global as any).document.cookie).to.equal(`${cookieName}=skip; path=/;`);
            chai.expect(navigateStub.calledOnce).to.be.true;
            chai.expect(navigateStub.firstCall.args[0]).to.equal('/test');
            chai.expect(mockDialog.remove.calledOnce).to.be.true;
        });

        it('should not set cookie or navigate when dialog is canceled', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const navigateStub = sinon.stub();
            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: true },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: navigateStub,
            };

            // Set initial cookie value
            const initialCookie = 'other=value';
            (global as any).document.cookie = initialCookie;

            let closeCallback: Function | null = null;
            const mockDialog = {
                innerHTML: '',
                addEventListener: (event: string, callback: Function) => {
                    if (event === 'close') {
                        closeCallback = callback;
                    }
                },
                showModal: sandbox.stub(),
                remove: sandbox.stub(),
                returnValue: 'no',
            };

            ((global as any).document.createElement as sinon.SinonStub).withArgs('dialog').returns(mockDialog);

            hook(mockTransition);

            chai.expect(closeCallback).to.not.be.null;

            // Trigger the close callback with 'no' returnValue
            closeCallback!();

            // Cookie should remain unchanged
            chai.expect((global as any).document.cookie).to.equal(initialCookie);
            chai.expect(navigateStub.called).to.be.false;
            chai.expect(mockDialog.remove.calledOnce).to.be.true;
        });

        it('should remove dialog after close regardless of confirmation result', () => {
            const hooks = plugin.getTransitionHooks();
            const hook = hooks[0];

            const mockTransition = {
                route: {
                    url: '/test',
                    meta: { protected: true },
                    hostname: 'example.com',
                    route: '/test',
                },
                prevRoute: {
                    url: '/prev',
                    meta: {},
                    hostname: 'example.com',
                    route: '/prev',
                },
                navigate: sinon.stub(),
            };

            (global as any).document.cookie = '';

            let closeCallback: Function | null = null;
            const mockDialog = {
                innerHTML: '',
                addEventListener: (event: string, callback: Function) => {
                    if (event === 'close') {
                        closeCallback = callback;
                    }
                },
                showModal: sandbox.stub(),
                remove: sandbox.stub(),
                returnValue: 'anything',
            };

            ((global as any).document.createElement as sinon.SinonStub).withArgs('dialog').returns(mockDialog);

            hook(mockTransition);
            closeCallback!();

            // Dialog should always be removed
            chai.expect(mockDialog.remove.calledOnce).to.be.true;
        });
    });
});
