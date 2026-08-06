import {
    ExperimentsRulesetPlugin,
    Ruleset,
} from './server.types';

const emptyRuleset: Ruleset = Object.freeze({});

/**
 * Default `experimentsRuleset` plugin: supplies no experiments at all.
 *
 * The other kinds default to a sample implementation, but a ruleset is data rather than behaviour —
 * ILC already has a source of its own, and a sample ruleset here would silently replace it for every
 * deployment that installed no plugin of this kind. Contributing nothing keeps "no plugin installed"
 * indistinguishable from the state before this kind existed.
 */
const plugin: ExperimentsRulesetPlugin = {
    type: 'experimentsRuleset',
    getRuleset: () => emptyRuleset,
};

export default plugin;
