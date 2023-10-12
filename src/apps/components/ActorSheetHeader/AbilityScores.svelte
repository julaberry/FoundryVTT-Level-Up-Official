<script>
    import { getContext } from "svelte";

    import AbilityScore from "./AbilityScore.svelte";

    const actor = getContext("actor");
</script>

<ul class="ability-scores">
    {#each Object.entries($actor.system.abilities) as [abilityLabel, ability], idx}
        <AbilityScore {ability} {abilityLabel} {idx} />
    {/each}
</ul>

<style lang="scss">
    .ability-scores {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        position: relative;
        gap: 0.625rem;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: $font-primary;
    }
</style>
