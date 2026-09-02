import chai from 'chai';

import plugin from './server';
import { ExperimentsRulesetPlugin, Ruleset } from './server.types';

describe('experimentsRuleset plugin', () => {
    it('should have correct plugin type', () => {
        chai.expect(plugin.type).to.equal('experimentsRuleset');
    });

    it('should offer no ruleset at all', () => {
        // `undefined`, not `{}`. The two are different answers: `undefined` says "ask your own
        // configuration", while `{}` says "there are deliberately no experiments right now" and is
        // honoured as given. The default has nothing to offer, so it says so.
        chai.expect(plugin.getRuleset()).to.equal(undefined);
    });

    it('should keep offering nothing on every call', () => {
        chai.expect(plugin.getRuleset()).to.equal(plugin.getRuleset());
    });

    it('should let an implementation express a deliberately empty ruleset', () => {
        // The distinction this type exists to preserve. A plugin backed by a remote source must be
        // able to publish "no experiments" — switching every experiment off at once — without that
        // being mistaken for "this plugin has no answer", which would send ILC back to its own
        // configuration and turn them all back on.
        const emptyOnPurpose: ExperimentsRulesetPlugin = {
            type: 'experimentsRuleset',
            getRuleset: () => ({}),
        };

        chai.expect(emptyOnPurpose.getRuleset()).to.deep.equal({});
        chai.expect(emptyOnPurpose.getRuleset()).to.not.equal(undefined);
    });

    it('should be assignable to a ruleset source that returns the SDK ruleset type', () => {
        // Compile-time check of the plugin's own contract: the plugin object is usable wherever a
        // "something that returns a Ruleset synchronously, or nothing" is expected, with no adapter.
        const source: { getRuleset(): Ruleset | undefined } = plugin;

        chai.expect(source.getRuleset()).to.equal(undefined);
    });
});
