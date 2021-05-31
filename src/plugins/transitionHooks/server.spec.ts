import http from 'http';
import chai from 'chai';
import sinon from 'sinon';
import assert from 'assert';

import {
    cookieName,
} from './browser';

import plugin from './server';

describe('Typescript usage suite', () => {
    it('should be able to execute a test', () => {
        assert.strictEqual(true, true);
    });
});

describe('Server transition hooks suite', () => {
    const log = {
        info: sinon.spy(),
        fatal: sinon.spy(),
        error: sinon.spy(),
        warn: sinon.spy(),
        debug: sinon.spy(),
        trace: sinon.spy(),
    };

    afterEach(() => {
        log.info.resetHistory();
        log.fatal.resetHistory();
        log.error.resetHistory();
        log.warn.resetHistory();
        log.debug.resetHistory();
        log.trace.resetHistory();
    });

    it('should continue if a route is not protected', async () => {
        const route = {
            meta: {
                protected: false,
            },
            url: '/some/url',
            hostname: 'example.com',
        };

        const req = {
            headers: {},
        } as http.IncomingMessage;

        const results = await Promise.all(plugin.getTransitionHooks().map((hook) => hook({route, req, log})));

        for (const result of results) {
            chai.expect(result).to.be.eql({type: 'continue'});
        }

        chai.expect(log.info.calledWith(route.meta)).to.be.true;
    });

    it('should continue if req has a special cookie', async () => {
        const route = {
            meta: {
                protected: true,
            },
            url: '/some/url',
            hostname: 'example.com',
        };

        const req = {
            headers: {
                cookie: `${cookieName}=skip; path=/;`,
            },
        } as http.IncomingMessage;

        const results = await Promise.all(plugin.getTransitionHooks().map((hook) => hook({route, req, log})));

        for (const result of results) {
            chai.expect(result).to.be.eql({type: 'continue'});
        }

        chai.expect(log.info.calledWith(route.meta)).to.be.true;
    });

    it('should redirect if req does not have a special cookie', async () => {
        const route = {
            meta: {
                protected: true,
            },
            url: '/some/url',
            hostname: 'example.com',
        };

        const req = {
            headers: {
                cookie: `some-cookie=skip; path=/;`,
            },
        } as http.IncomingMessage;

        const results = await Promise.all(plugin.getTransitionHooks().map((hook) => hook({route, req, log})));

        chai.expect(results).to.have.deep.members([{type: 'redirect', newLocation: '/'}]);
        chai.expect(log.info.calledWith(route.meta)).to.be.true;
    });

    it('should redirect if req does not have any cookies', async () => {
        const route = {
            meta: {
                protected: true,
            },
            url: '/some/url',
            hostname: 'example.com',
        };

        const req = {
            headers: {},
        } as http.IncomingMessage;

        const results = await Promise.all(plugin.getTransitionHooks().map((hook) => hook({route, req, log})));

        chai.expect(results).to.have.deep.members([{type: 'redirect', newLocation: '/'}]);
        chai.expect(log.info.calledWith(route.meta)).to.be.true;
    });
});
