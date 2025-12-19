import chai from 'chai';
import sinon from 'sinon';
import split from 'split2';
import pino, { type DestinationStream } from 'pino';

import { pinoConf, plugin } from './server';
import { IlcError } from './server.types';

function sink(spyFunc: (...args: any[]) => void): DestinationStream {
    const result = split((data) => {
        try {
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
            console.log(data);
        }
    });
    result.on('data', (data) => spyFunc(data));
    return result;
}

describe('reporting server plugin', () => {
    it('should have correct plugin type', () => {
        chai.expect(plugin.type).to.equal('reporting');
    });

    it('should have logger property', () => {
        chai.expect(plugin.logger).to.exist;
        chai.expect(plugin.logger).to.have.property('info');
        chai.expect(plugin.logger).to.have.property('error');
        chai.expect(plugin.logger).to.have.property('warn');
    });

    it('should have requestIdLogLabel property', () => {
        chai.expect(plugin.requestIdLogLabel).to.equal('operationId');
    });

    it('should have genReqId function', () => {
        chai.expect(plugin.genReqId).to.be.a('function');
    });

    it('should generate unique request IDs', () => {
        const id1 = plugin.genReqId!();
        const id2 = plugin.genReqId!();

        chai.expect(id1).to.be.a('string');
        chai.expect(id2).to.be.a('string');
        chai.expect(id1).to.not.equal(id2);
    });

    it('should generate fixed-length URL-safe request IDs', () => {
        const id = plugin.genReqId!();

        // hyperid with fixedLength: true and urlSafe: true produces 33 character IDs
        chai.expect(id).to.have.lengthOf(33);
        // URL-safe means no + or / characters
        chai.expect(id).to.not.include('+');
        chai.expect(id).to.not.include('/');
    });

    describe('logMethod hook', () => {
        const spyOnPinoOutput = sinon.spy();
        const spyStream = sink(spyOnPinoOutput);
        const logger = pino(pinoConf, spyStream);

        beforeEach(() => spyOnPinoOutput.resetHistory());

        it('should transform Error instances with type, message, and stack', () => {
            const error = new Error('Test error message');
            error.name = 'TestError';

            logger.error(error);

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                level: 50,
                type: 'TestError',
                message: 'Test error message',
                stack: sinon.match.array,
            }));
        });

        it('should include additionalInfo when error has data property', () => {
            const error = new Error('Test error with data') as IlcError;
            error.data = { userId: '123', action: 'test' };

            logger.error(error);

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                type: 'Error',
                message: 'Test error with data',
                additionalInfo: { userId: '123', action: 'test' },
            }));
        });

        it('should not include additionalInfo when error has no data property', () => {
            const error = new Error('Test error without data');

            logger.error(error);

            sinon.assert.calledOnce(spyOnPinoOutput);
            const logged = spyOnPinoOutput.firstCall.args[0];
            chai.expect(logged).to.not.have.property('additionalInfo');
        });

        it('should process error causes and include causeData with correct order', () => {
            const rootCause = new Error('Root cause') as IlcError;
            rootCause.data = { level: 3 };

            const middleCause = new Error('Middle cause') as IlcError;
            middleCause.data = { level: 2 };
            middleCause.cause = rootCause;

            const error = new Error('Top level error') as IlcError;
            error.data = { level: 1 };
            error.cause = middleCause;

            logger.error(error);

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                message: 'Top level error',
                additionalInfo: { level: 1 },
                causeData: [{ level: 2 }, { level: 3 }],
            }));
        });

        it('should include empty objects in causeData for causes without data', () => {
            const rootCause = new Error('Root cause without data') as IlcError;

            const error = new Error('Error with cause') as IlcError;
            error.cause = rootCause;

            logger.error(error);

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                message: 'Error with cause',
                causeData: [{}],
            }));
        });

        it('should not include causeData when error has no cause', () => {
            const error = new Error('Error without cause');

            logger.error(error);

            sinon.assert.calledOnce(spyOnPinoOutput);
            const logged = spyOnPinoOutput.firstCall.args[0];
            chai.expect(logged).to.not.have.property('causeData');
        });

        it('should not transform non-Error inputs', () => {
            logger.info('Just a message');

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                level: 30,
                msg: 'Just a message',
            }));

            const logged = spyOnPinoOutput.firstCall.args[0];
            chai.expect(logged).to.not.have.property('type');
            chai.expect(logged).to.not.have.property('stack');
        });

        it('should not transform object inputs', () => {
            logger.info({ customField: 'value' }, 'Message with object');

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                level: 30,
                msg: 'Message with object',
                customField: 'value',
            }));

            const logged = spyOnPinoOutput.firstCall.args[0];
            chai.expect(logged).to.not.have.property('type');
        });
    });

    describe('res serializer', () => {
        const spyOnPinoOutput = sinon.spy();
        const spyStream = sink(spyOnPinoOutput);
        const logger = pino(pinoConf, spyStream);

        beforeEach(() => spyOnPinoOutput.resetHistory());

        it('should serialize response with statusCode and empty headers for 200', () => {
            const mockRes = { statusCode: 200 };

            logger.info({ res: mockRes }, 'Request completed');

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                msg: 'Request completed',
                res: { statusCode: 200, headers: {} },
            }));
        });

        it('should include location header for redirect responses', () => {
            const mockRes = {
                statusCode: 302,
                _header: 'HTTP/1.1 302 Found\r\nLocation: https://example.com/redirected\r\n\r\n'
            };

            logger.info({ res: mockRes }, 'Redirect');

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                msg: 'Redirect',
                res: {
                    statusCode: 302,
                    headers: { location: 'https://example.com/redirected' }
                },
            }));
        });

        it('should not include location header for non-redirect responses', () => {
            const mockRes = {
                statusCode: 200,
                _header: 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n'
            };

            logger.info({ res: mockRes }, 'Normal response');

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                res: { statusCode: 200, headers: {} },
            }));
        });

        it('should handle redirect without location header', () => {
            const mockRes = {
                statusCode: 301,
                _header: 'HTTP/1.1 301 Moved Permanently\r\n\r\n'
            };

            logger.info({ res: mockRes }, 'Redirect without location');

            sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                res: { statusCode: 301, headers: {} },
            }));
        });

        it('should handle all redirect status codes (3xx range)', () => {
            const redirectCodes = [301, 302, 303, 307, 308];

            redirectCodes.forEach((statusCode) => {
                spyOnPinoOutput.resetHistory();

                const mockRes = {
                    statusCode,
                    _header: `HTTP/1.1 ${statusCode} Redirect\r\nLocation: https://example.com/${statusCode}\r\n\r\n`
                };

                logger.info({ res: mockRes }, `Redirect ${statusCode}`);

                sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                    res: {
                        statusCode,
                        headers: { location: `https://example.com/${statusCode}` }
                    },
                }));
            });
        });

        it('should not include location for status codes outside 3xx range', () => {
            const nonRedirectCodes = [200, 201, 400, 404, 500];

            nonRedirectCodes.forEach((statusCode) => {
                spyOnPinoOutput.resetHistory();

                const mockRes = {
                    statusCode,
                    _header: `HTTP/1.1 ${statusCode} Response\r\nLocation: https://should-be-ignored.com\r\n\r\n`
                };

                logger.info({ res: mockRes }, `Response ${statusCode}`);

                sinon.assert.calledWith(spyOnPinoOutput, sinon.match({
                    res: { statusCode, headers: {} },
                }));
            });
        });
    });
});
