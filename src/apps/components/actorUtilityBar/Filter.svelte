<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSMenu, TJSToggleIconButton } from "#standard/component";

    import arraysAreEqual from "../../../utils/arraysAreEqual";
    import updateFilters from "../../../utils/updateFilters";

    import MultiStateCheckBoxGroup from "../MultiStateCheckBoxGroup.svelte";

    export let reducerId = "";
    export let reducerType;
    export let reducer = null;

    const actor = getContext("actor");

    if (!reducer) {
        reducer = actor[reducerType];
    }

    function getFilterTooltip(numInclusiveFilters, numExclusiveFilters) {
        if (numInclusiveFilters && numExclusiveFilters) {
            return `Inclusive Filters: ${numInclusiveFilters} &nbsp;&nbsp;|&nbsp;&nbsp; Exclusive Filers: ${numExclusiveFilters}`;
        } else if (numInclusiveFilters) {
            return `Inclusive Filters: ${numInclusiveFilters}`;
        } else if (numExclusiveFilters) {
            return `Exclusive Filters: ${numExclusiveFilters}`;
        } else {
            return null;
        }
    }

    function onUpdateFilters(inclusiveFilters, exclusiveFilters) {
        $actor.setFlag("a5e", flagId, {
            inclusive: inclusiveFilters,
            exclusive: exclusiveFilters,
        });

        activeFilters.inclusive = inclusiveFilters;
        activeFilters.exclusive = exclusiveFilters;

        updateFilters(reducer, reducerType, activeFilters);
    }

    function toggleAll(filters) {
        filters = Object.keys(filters);
        const sectionFilters = activeFilters?.inclusive?.filter((f) =>
            filters.includes(f),
        );

        if (arraysAreEqual(sectionFilters, filters)) {
            const inclusiveFilters = activeFilters?.inclusive?.filter(
                (f) => !filters.includes(f),
            );
            return onUpdateFilters(inclusiveFilters, []);
        }

        const inclusiveFilters = new Set([...filters, ...activeFilters?.inclusive]);

        return onUpdateFilters([...inclusiveFilters], []);
    }

    const filterSections = Object.values(CONFIG.A5E.filters[reducerType] ?? {});
    const flagId = reducerId
        ? `filters.${reducerType}.${reducerId}`
        : `filters.${reducerType}`;
    let activeFilters = $actor.getFlag("a5e", flagId) ?? {};

    $: numInclusiveFilters = activeFilters?.inclusive?.length ?? 0;
    $: numExclusiveFilters = activeFilters?.exclusive?.length ?? 0;
    $: filterTooltip = getFilterTooltip(numInclusiveFilters, numExclusiveFilters);

    updateFilters(reducer, reducerType, activeFilters);
</script>

<span
    class="filter-hints"
    class:filter-hints--green={numInclusiveFilters}
    class:filter-hints--red={numExclusiveFilters}
    data-tooltip={filterTooltip}
    data-tooltip-direction="UP"
>
    <TJSToggleIconButton
        title="Filters"
        icon="fas fa-filter"
        --tjs-icon-button-background-hover="none"
        --tjs-icon-button-background-focus="none"
        --tjs-icon-button-background-focus-visible="none"
        --tjs-icon-button-background-selected="none"
        --tjs-icon-button-text-shadow-hover="none"
        --tjs-icon-button-text-shadow-focus="none"
        --tjs-icon-button-transition="var(--a5e-transition-standard)"
        --tjs-icon-button-diameter="1.1rem"
        --tjs-icon-button-border-radius="0"
    >
        <TJSMenu>
            <article class="filter-box">
                {#each filterSections as { label, filters }}
                    <section class="filter-section">
                        <header class="u-align-center u-flex u-gap-lg">
                            <h3 class="u-text-sm u-text-bold">
                                {localize(label)}
                            </h3>

                            <button
                                class=" filter-button u-text-xs"
                                on:click|stopPropagation={() => toggleAll(filters)}
                            >
                                {localize("A5E.ButtonToggleAll")}
                            </button>
                        </header>

                        <div class="filters u-text-xs u-w-full">
                            <MultiStateCheckBoxGroup
                                options={Object.entries(filters).map(
                                    ([value, { label }]) => [value, label],
                                )}
                                selected={[
                                    activeFilters?.inclusive ?? [],
                                    activeFilters?.exclusive ?? [],
                                ]}
                                on:updateSelection={({ detail }) =>
                                    onUpdateFilters(detail[0], detail[1])}
                            />
                        </div>
                    </section>
                {/each}

                <div class="hint">
                    Hint: Right-click a filter to quickly remove it from the selection.
                </div>
            </article>
        </TJSMenu>
    </TJSToggleIconButton>
</span>

<style lang="scss">
    .filter-box {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem 0.5rem;
    }

    .filter-section {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .filter-button {
        background: none;
        border: 0;
        padding: 0;
        width: fit-content;
        color: inherit;

        &:hover,
        &:focus {
            box-shadow: none;
            text-shadow: 0 0 8px var(--color-shadow-primary);
        }
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        width: 20rem;
        margin: 0;
        padding: 0;
    }

    .hint {
        font-size: var(--a5e-text-size-xs);
    }

    .filter-hints {
        position: relative;

        &--green {
            color: var(--a5e-color-primary);
        }

        &--red {
            color: var(--a5e-color-error);
        }
    }
</style>
