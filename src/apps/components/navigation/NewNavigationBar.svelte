<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import toggleSheetLockedState from "../../handlers/toggleSheetLockedState";

    import NavigationItem from "./NewNavigationItem.svelte";

    export let currentTab;
    export let tabs;
    export let showLock = false;

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<nav class="a5e-nav-wrapper">
    <!-- This allows us to reserve enough space for the largest tab name -->
    {#each Object.entries(tabs) as [name, { label }]}
        <span
            class="current-tab-label"
            class:current-tab-label--active={name === currentTab}
        >
            {localize(label)}
        </span>
    {/each}

    <ul class="a5e-nav-list">
        {#each Object.entries(tabs) as [name, tab]}
            {#if tab?.display ?? true}
                <NavigationItem on:tab-change {tab} {name} {currentTab} />
            {/if}
        {/each}

        <!-- svelte-ignore missing-declaration -->
        {#if showLock && $actor.permission !== CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER}
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
            <li
                class="a5e-nav-item a5e-nav-item--lock fa-solid {sheetIsLocked
                    ? 'fa-lock'
                    : 'fa-unlock'}"
                class:a5e-nav-item--active={sheetIsLocked}
                on:click={({ target }) => {
                    toggleSheetLockedState($actor);
                    target.blur();
                }}
                data-tooltip="Toggle Sheet Lock"
                data-tooltip-direction="UP"
            />
        {/if}

        <!-- svelte-ignore missing-declaration -->
        <!-- {#if showAdd}
            <AddButton on:add-button-clicked />
        {/if} -->
    </ul>
</nav>

<style lang="scss">
    .current-tab-label {
        grid-area: current;
        opacity: 0;
        font-size: 0.833rem;
        text-align: center;

        &--active {
            opacity: 1;
        }
    }

    @container sheet (height > 700px) {
        .current-tab-label {
            text-align: left;
        }
    }
</style>
