<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import AddButton from "./AddButton.svelte";
    import LockButton from "./LockButton.svelte";
    import NavigationItem from "./NewNavigationItem.svelte";

    const actor = getContext("actor");

    export let currentTab;
    export let tabs;
    export let showLock = false;
    export let showAdd = false;
</script>

<nav class="a5e-nav-wrapper">
    <!-- This allows us to reserve enough space for the largest tab name -->
    {#each tabs as { name, label }}
        <span
            class="current-tab-label"
            class:current-tab-label--active={name === currentTab.name}
        >
            {localize(label)}
        </span>
    {/each}

    <ul class="a5e-nav-list">
        {#each tabs as tab, index}
            {#if tab?.display ?? true}
                <NavigationItem on:tab-change {tab} {index} {currentTab} />
            {/if}
        {/each}

        <!-- svelte-ignore missing-declaration -->
        <!-- {#if showLock && $actor.permission !== CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER}
            <LockButton />
        {/if} -->

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

        &--active {
            opacity: 1;
        }
    }
</style>
