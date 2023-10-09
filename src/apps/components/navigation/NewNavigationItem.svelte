<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let currentTab;
    export let index;
    export let tab;

    const dispatch = createEventDispatcher();
</script>

<li
    class="a5e-nav-item {tab.icon}"
    class:a5e-nav-item--active={tab.name === currentTab.name}
    on:click={() => dispatch("tab-change", index)}
    data-tooltip={localize(tab.label)}
    data-tooltip-direction="UP"
/>
