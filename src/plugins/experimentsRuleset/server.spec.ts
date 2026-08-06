import chai from 'chai';

import plugin from './server';
import { Ruleset } from './server.types';

describe('experimentsRuleset plugin', () => {
    it('should have correct plugin type', () => {
        chai.expect(plugin.type).to.equal('experimentsRuleset');
    });

    it('should supply an empty ruleset', () => {
        chai.expect(plugin.getRuleset()).to.deep.equal({});
    });

    it('should supply the very same ruleset on every call', () => {
        // ILC calls getRuleset() per request, so an implementation that allocated on every call
        // would allocate per request. The default answers from a single frozen object.
        chai.expect(plugin.getRuleset()).to.be.equals(plugin.getRuleset());
    });

    it('should supply a ruleset a consumer cannot mutate', () => {
        const ruleset = plugin.getRuleset() as Record<string, unknown>;

        chai.expect(() => {
            ruleset['some-experiment'] = { status: 'active', variants: [{ name: 'a', weight: 100 }] };
        }).to.throw();
    });

    it('should be assignable to a ruleset source that returns the SDK ruleset type', () => {
        // Compile-time check of the plugin's own contract: the plugin object is usable wherever a
        // "something that returns a Ruleset synchronously" is expected, without an adapter.
        const source: { getRuleset(): Ruleset } = plugin;

        chai.expect(source.getRuleset()).to.deep.equal({});
    });
});
