import { ExperimentsRulesetPlugin } from './server.types';

/**
 * Default `experimentsRuleset` plugin: offers no ruleset at all.
 *
 * The other kinds default to a sample implementation, but a ruleset is data rather than behaviour —
 * ILC already has a source of its own, and a sample ruleset here would silently replace it for every
 * deployment that installed no plugin of this kind. Contributing nothing keeps "no plugin installed"
 * indistinguishable from the state before this kind existed.
 *
 * It returns `undefined` rather than `{}` on purpose: `{}` is a real answer meaning "deliberately no
 * experiments", which ILC honours. Only `undefined` says "ask your own configuration instead".
 */
const plugin: ExperimentsRulesetPlugin = {
    type: 'experimentsRuleset',
    getRuleset: () => undefined,
};

export default plugin;
