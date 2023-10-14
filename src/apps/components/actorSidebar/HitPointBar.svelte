<script>
    import { getContext } from "svelte";

    export let hp;

    function convertToPercentage(value) {
        return `${value}%`;
    }

    function calculatePrimaryHPColor(hp) {
        const hpPercentage = Math.min((hp.value / hp.max) * 100, 100);
        return `hsl(${Math.round(hpPercentage)}, 50%, 35%)`;
    }

    function calculatePrimaryHPPercentage(hp, totalHPPercentage) {
        const tempHP = hp.temp || 0;

        const hpPercentage = Math.min(
            (hp.value / (hp.max + tempHP)) * 100,
            100
        );

        return (hpPercentage / calculateTotalHPPercentage(hp)) * 100;
    }

    function calculateTotalHPPercentage(hp) {
        const tempHP = hp.temp || 0;

        return Math.min(
            ((hp.value + (hp.temp || 0)) / (hp.max + tempHP)) * 100,
            100
        );
    }

    const actor = getContext("actor");

    $: primaryHPColor = calculatePrimaryHPColor(hp);

    $: primaryHPPercentage = convertToPercentage(
        calculatePrimaryHPPercentage(hp)
    );

    $: totalHPPercentage = convertToPercentage(calculateTotalHPPercentage(hp));

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="a5e-hp-track-wrapper">
    <div
        class="a5e-hp-track"
        style="
        --color-primary-hp-bar: {primaryHPColor};
        --primary-hp-percentage: {primaryHPPercentage};
        --total-hp-percentage: {totalHPPercentage};
    "
    />

    {#if sheetIsLocked}
        <button
            class="fas fa-cog hp__config-button"
            data-tooltip="Configure Hit Dice"
            data-tooltip-direction="DOWN"
            on:click={() => $actor.configureHealth()}
        />
    {/if}
</div>

<style lang="scss">
    .a5e-hp-track-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .hp__config-button {
        width: fit-content;
        margin: 0;
        padding: 0;
        background: transparent;
        color: rgba(0, 0, 0, 0.25);

        transition: $standard-transition;

        &:focus,
        &:hover {
            color: #555;
            box-shadow: none;
            transform: scale(1.2);
        }
    }
</style>
