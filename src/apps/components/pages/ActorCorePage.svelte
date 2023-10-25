<script>
    import { getContext, onDestroy } from "svelte";

    import GenericActorResource from "../GenericActorResource.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import ActorSkillsPage from "./ActorSkillsPage.svelte";

    import usesRequired from "../../../utils/usesRequired";
    import quantityRequired from "../../../utils/quantityRequired";

    export let resources;

    const actor = getContext("actor");
    const { favorites } = actor;

    let showQuantity = quantityRequired($favorites);
    let showUses = usesRequired($favorites);

    $: resources = $actor.system.resources;
    $: flags = $actor.flags;

    const unsubscribe = favorites.subscribe((_) => {
        showQuantity = quantityRequired($favorites);
        showUses = usesRequired($favorites);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if !(flags.a5e?.hideGenericResources ?? $actor.type === "npc")}
    <ol class="resources-container">
        {#each Object.entries(resources) as [source, resource]}
            <GenericActorResource {resource} {source} />
        {/each}
    </ol>
{/if}

{#if flags.a5e?.showFavoritesSection ?? true}
    <section class="a5e-page-wrapper a5e-page-wrapper--core">
        <ItemCategory
            label="A5E.FavoriteItems"
            icon="fas fa-star heading-icon"
            items={[...$favorites]}
            type="favorites"
            {showQuantity}
            {showUses}
        />
    </section>
{:else}
    <ActorSkillsPage />
{/if}

<style lang="scss">
    .resources-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        gap: 0.5rem;
        grid-area: resources;
        width: 100%;
        margin: 0;
        padding: 0.5rem;
        list-style: none;
    }
</style>
