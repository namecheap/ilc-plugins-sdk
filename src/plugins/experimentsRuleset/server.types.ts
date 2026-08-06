import {
    Plugin,
} from '../../pluginManager/server.types';

/*
 * The ruleset shape is declared here rather than imported from ILC on purpose: `ilc` depends on
 * `ilc-plugins-sdk`, so reaching back into ILC's own `server/experiments/interfaces` would make the
 * two packages depend on each other, and a plugin author would have to install ILC just to type a
 * plugin. These declarations mirror the shape ILC evaluates, and since TypeScript is structural a
 * plugin typed against them satisfies ILC's ruleset-source interface with no adapter in between.
 */

/** Stable experiment identifier, e.g. `homepage-hero`. */
export type ExperimentId = string;

/** Stable variant identifier surfaced to apps, e.g. `variant-a`. */
export type VariantName = string;

/**
 * `active` — variants are bucketed and assigned.
 * `paused` — experiment is ignored; visitors fall back to the baseline (no assignment).
 */
export type ExperimentStatus = 'active' | 'paused';

export interface ExperimentVariant {
    /** Variant identifier the app branches on. */
    readonly name: VariantName;
    /** Allocation weight. Weights within one experiment are expected to sum to 100. */
    readonly weight: number;
}

/**
 * Optional gate on *first-time enrollment only*: a visitor joins the experiment population only
 * while requesting one of the listed path prefixes. It narrows who joins, not where the experiment
 * applies — a visitor who is already enrolled keeps their assignment on every route.
 */
export interface ExperimentEnrollment {
    readonly paths: readonly string[];
}

export interface Experiment {
    readonly status: ExperimentStatus;
    /** Declaration order is meaningful: variants own contiguous slices of the bucket space. */
    readonly variants: readonly ExperimentVariant[];
    /**
     * Optional consent gate. The category is an opaque string resolved by a consent resolver
     * registered in the deployment; with no resolver a categorised experiment is not assigned.
     */
    readonly consentCategory?: string;
    /** Optional first-touch enrollment gate (see {@link ExperimentEnrollment}). */
    readonly enrollment?: ExperimentEnrollment;
}

/** The complete set of experiments, keyed by experiment id. */
export type Ruleset = Readonly<Record<ExperimentId, Experiment>>;

/**
 * Supplies the experiment ruleset ILC evaluates, letting a deployment take the definitions from
 * somewhere other than ILC's own configuration.
 *
 * `getRuleset` is synchronous: it is called while resolving a request, so it must answer from
 * memory and never perform I/O. A plugin backed by a remote source is expected to keep its
 * in-memory copy fresh out-of-band (polling or SSE) and serve every call from that copy.
 *
 * Returning `undefined` means "this plugin has no ruleset to offer" — it has not filled its copy yet,
 * or it has lost its source — and ILC then falls back to its own configuration. An EMPTY ruleset is a
 * different answer and is honoured as given: it means "there are deliberately no experiments right
 * now". The distinction matters because a remote source may legitimately publish an empty ruleset to
 * switch every experiment off at once, and collapsing that into "nothing supplied" would make ILC fall
 * back to stale configuration and turn them all back on.
 */
export declare interface ExperimentsRulesetPlugin extends Plugin {
    type: 'experimentsRuleset';
    getRuleset: () => Ruleset | undefined;
}
