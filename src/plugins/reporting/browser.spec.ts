import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub, stub } from 'sinon';
import { IlcLogger, IlcReportingPlugin } from './browser.types';
import { consoleReportingPlugin, reportingPluginsWrapper } from './browser';

describe('Reporting browser', () => {
    describe('Console reporting plugin', () => {
        it('should have type reporting', () => {
            expect(consoleReportingPlugin.type).to.equal('reporting');
        });

        describe('logger', () => {
            let sandbox: SinonSandbox;
            let warnStub: SinonStub;
            let infoStub: SinonStub;
            let errorStub: SinonStub;
            let debugStub: SinonStub;
            let traceStub: SinonStub;

            let logger: IlcLogger;

            beforeEach(() => {
                logger = consoleReportingPlugin.logger;
                sandbox = createSandbox();

                warnStub = sandbox.stub(console, 'warn');
                infoStub = sandbox.stub(console, 'info');
                errorStub = sandbox.stub(console, 'error');
                debugStub = sandbox.stub(console, 'debug');
                traceStub = sandbox.stub(console, 'trace');
            });

            afterEach(() => {
                sandbox.restore();
            });

            describe('message',() => {
                it('should invoke console.warn on logger.warn', () => {
                    logger.warn('Warn message');
                    expect(warnStub.calledOnce).to.be.true;
                    expect(warnStub.calledWithExactly('Warn message')).to.be.true;
                });

                it('should invoke console.info on logger.info', () => {
                    logger.info('Info message');
                    expect(infoStub.calledOnce).to.be.true;
                    expect(infoStub.calledWithExactly('Info message')).to.be.true;
                });

                it('should invoke console.error on logger.error', () => {
                    logger.error('Error message');
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Error message')).to.be.true;
                });
                
                it('should invoke console.error on logger.fatal', () => {
                    logger.error('Fatal message');
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Fatal message')).to.be.true;
                });

                it('should invoke console.debug on logger.debug', () => {
                    logger.debug('Debug message');
                    expect(debugStub.calledOnce).to.be.true;
                    expect(debugStub.calledWithExactly('Debug message')).to.be.true;
                });

                it('should invoke console.trace on logger.trace', () => {
                    logger.trace('Trace message');
                    expect(traceStub.calledOnce).to.be.true;
                    expect(traceStub.calledWithExactly('Trace message')).to.be.true;
                });
            });

            describe('message with plain object',() => {
                const logObject = {
                    hot: 'cake'
                };

                it('should invoke console.warn on logger.warn', () => {
                    logger.warn('Warn message', logObject);
                    expect(warnStub.calledOnce).to.be.true;
                    expect(warnStub.calledWithExactly('Warn message', logObject)).to.be.true;
                });

                it('should invoke console.info on logger.info', () => {
                    logger.info('Info message', logObject);
                    expect(infoStub.calledOnce).to.be.true;
                    expect(infoStub.calledWithExactly('Info message', logObject)).to.be.true;
                });

                it('should invoke console.error on logger.error', () => {
                    logger.error('Error message', logObject);
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Error message', logObject)).to.be.true;
                });
                
                it('should invoke console.error on logger.fatal', () => {
                    logger.error('Fatal message', logObject);
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Fatal message', logObject)).to.be.true;
                });

                it('should invoke console.debug on logger.debug', () => {
                    logger.debug('Debug message', logObject);
                    expect(debugStub.calledOnce).to.be.true;
                    expect(debugStub.calledWithExactly('Debug message', logObject)).to.be.true;
                });

                it('should invoke console.trace on logger.trace', () => {
                    logger.trace('Trace message', logObject);
                    expect(traceStub.calledOnce).to.be.true;
                    expect(traceStub.calledWithExactly('Trace message', logObject)).to.be.true;
                });
            });

            describe('message with error',() => {
                const logError = new Error('Log error');
                const logErrorInfo = JSON.stringify({
                    type: 'Error',
                    message: 'Log error',
                    stack: (logError.stack || '').split('\n'),
                });

                it('should transform error before invoke console.warn on logger.warn', () => {
                    logger.warn('Warn message', logError);
                    expect(warnStub.calledOnce).to.be.true;
                    expect(warnStub.calledWithExactly('Warn message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.info on logger.info', () => {
                    logger.info('Info message', logError);
                    expect(infoStub.calledOnce).to.be.true;
                    expect(infoStub.calledWithExactly('Info message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.error on logger.error', () => {
                    logger.error('Error message', logError);
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Error message', logErrorInfo, logError)).to.be.true;
                });
                
                it('should transform error before console.error on logger.fatal', () => {
                    logger.error('Fatal message', logError);
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Fatal message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.debug on logger.debug', () => {
                    logger.debug('Debug message', logError);
                    expect(debugStub.calledOnce).to.be.true;
                    expect(debugStub.calledWithExactly('Debug message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.trace on logger.trace', () => {
                    logger.trace('Trace message', logError);
                    expect(traceStub.calledOnce).to.be.true;
                    expect(traceStub.calledWithExactly('Trace message', logErrorInfo, logError)).to.be.true;
                });
            });

            describe('message with ilcError',() => {
                const logError = Object.assign(new Error('Log error'), {
                    data: {
                        hot: 'cake',
                    },
                    code: 'test.runtime',
                    errorId: '7216ea27-408a-4a4f-82d5-8f47fd030e8e',
                });

                const logErrorInfo = JSON.stringify({
                    type: 'Error',
                    message: 'Log error',
                    stack: (logError.stack || '').split('\n'),
                    additionalInfo: {
                        hot: 'cake',
                        code: 'test.runtime',
                        errorId: '7216ea27-408a-4a4f-82d5-8f47fd030e8e',
                    },
                });

                it('should transform error before invoke console.warn on logger.warn', () => {
                    logger.warn('Warn message', logError);
                    expect(warnStub.calledOnce).to.be.true;
                    expect(warnStub.calledWithExactly('Warn message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.info on logger.info', () => {
                    logger.info('Info message', logError);
                    expect(infoStub.calledOnce).to.be.true;
                    expect(infoStub.calledWithExactly('Info message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.error on logger.error', () => {
                    logger.error('Error message', logError);
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Error message', logErrorInfo, logError)).to.be.true;
                });
                
                it('should transform error before console.error on logger.fatal', () => {
                    logger.error('Fatal message', logError);
                    expect(errorStub.calledOnce).to.be.true;
                    expect(errorStub.calledWithExactly('Fatal message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.debug on logger.debug', () => {
                    logger.debug('Debug message', logError);
                    expect(debugStub.calledOnce).to.be.true;
                    expect(debugStub.calledWithExactly('Debug message', logErrorInfo, logError)).to.be.true;
                });

                it('should transform error before console.trace on logger.trace', () => {
                    logger.trace('Trace message', logError);
                    expect(traceStub.calledOnce).to.be.true;
                    expect(traceStub.calledWithExactly('Trace message', logErrorInfo, logError)).to.be.true;
                });
            });

        });
    });

    describe('Reporting plugins wrapper', () => {
        let firstStubReporter: IlcReportingPlugin;
        let secondStubReporter: IlcReportingPlugin;
        let wrappedReporingPlugin: IlcReportingPlugin;
        
        const logObject = {
            hot: 'cake'
        };

        const logError = new Error('Log error');

        const logIlcError = Object.assign(new Error('Log error'), {
            data: {
                hot: 'cake',
            },
            code: 'test.runtime',
            errorId: '7216ea27-408a-4a4f-82d5-8f47fd030e8e',
        });

        beforeEach(() => {
            firstStubReporter = {
                type: 'reporting',
                logger: {
                    warn: stub(),
                    info: stub(), 
                    fatal: stub(),
                    error: stub(),
                    debug: stub(),
                    trace: stub(),
                },
                setConfig: stub(),
            };
            
            secondStubReporter = {
                type: 'reporting',
                logger: {
                    warn: stub(),
                    info: stub(), 
                    fatal: stub(),
                    error: stub(),
                    debug: stub(),
                    trace: stub(),
                },
                setConfig: stub(),
            };
    
            wrappedReporingPlugin = reportingPluginsWrapper([firstStubReporter, secondStubReporter]);
        });

        it('should have reporting type', () => {
            expect(wrappedReporingPlugin.type).to.equal('reporting');
        });

        it('shoud set config on every wrapped reporter', () => {
            const ilcConfig = {
                getConfig: stub(),
                getConfigForApps: stub(),
                getConfigForAppByName: stub(),
                getSettings: stub(),
                getSettingsByKey: stub(),
                getConfigForSharedLibs: stub(),
                getConfigForSharedLibsByName: stub(),
            };

            wrappedReporingPlugin.setConfig(ilcConfig);

            expect((firstStubReporter.setConfig as SinonStub).calledWithExactly(ilcConfig)).to.be.true;
            expect((secondStubReporter.setConfig as SinonStub).calledWithExactly(ilcConfig)).to.be.true;
        });

        const methods: (keyof IlcLogger)[] = ['warn', 'info', 'debug', 'trace', 'fatal', 'error'];
        methods.forEach((methodName: keyof IlcLogger) => {
            it(`should call method on every wrapped reporter logger when logger.${methodName} invoked`, () => {
                wrappedReporingPlugin.logger[methodName](`${methodName} message`);
                wrappedReporingPlugin.logger[methodName](`${methodName} message`, logObject);
                wrappedReporingPlugin.logger[methodName](`${methodName} message`, logError);
                wrappedReporingPlugin.logger[methodName](`${methodName} message`, logIlcError);

                expect((firstStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`)).to.be.true;
                expect((firstStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`, logObject)).to.be.true;
                expect((firstStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`, logError)).to.be.true;
                expect((firstStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`, logIlcError)).to.be.true;

                expect((secondStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`)).to.be.true;
                expect((secondStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`, logObject)).to.be.true;
                expect((secondStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`, logError)).to.be.true;
                expect((secondStubReporter.logger[methodName] as SinonStub).calledWithExactly(`${methodName} message`, logIlcError)).to.be.true;
            });
        });
    });
});
