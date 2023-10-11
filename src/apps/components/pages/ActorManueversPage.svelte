<script>
    import { getContext, onDestroy } from "svelte";

    import usesRequired from "../../../utils/usesRequired";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const actor = getContext("actor");
    const { maneuvers } = actor;

    const subTypes = CONFIG.A5E.maneuverDegrees;
    const reducerType = "maneuvers";

    let showDescription = false;
    let showUses = usesRequired(maneuvers);

    $: menuList = Object.entries(subTypes);

    const unsubscribe = maneuvers.subscribe((_) => {
        showUses = usesRequired(maneuvers);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--has-footer">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <ShowDescription
                on:updateSelection={() => (showDescription = !showDescription)}
            />
            <Sort {reducerType} />
            <Filter {reducerType} />
            <CreateMenu {reducerType} {menuList} />
        </UtilityBar>
    {/if}

    <section class="a5e-item-list-wrapper">
        {#each Object.entries($maneuvers._degrees) as [label, items]}
            {#if items.length}
                <ItemCategory
                    {label}
                    {items}
                    {showDescription}
                    {showUses}
                    type="maneuverDegrees"
                />
            {/if}
        {/each}
    </section>
</div>
