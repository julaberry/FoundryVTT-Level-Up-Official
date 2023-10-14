<script>
    import { getContext, onDestroy } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Currency from "../Currency.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../../utils/usesRequired";
    import quantityRequired from "../../../utils/quantityRequired";

    const actor = getContext("actor");
    const { objects } = actor;
    const { A5E } = CONFIG;

    const sortMap = A5E.reducerSortMap.objects;
    const subTypes = A5E.objectTypes;
    const reducerType = "objects";

    let showDescription = false;
    let showUses = usesRequired(objects);
    let showQuantity = quantityRequired(objects);

    $: menuList = Object.entries(subTypes);

    $: sortedObjects = Object.entries($objects._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]]
    );

    const unsubscribe = objects.subscribe((_) => {
        showUses = usesRequired(objects);
        showQuantity = quantityRequired(objects);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div
    class="a5e-page-wrapper"
    class:a5e-page-wrapper--has-footer={$actor.flags?.a5e
        ?.trackInventoryWeight ?? true}
>
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

    <Currency />

    <section class="a5e-item-list-wrapper">
        {#each sortedObjects as [label, items]}
            {#if items.length}
                <ItemCategory
                    {label}
                    {items}
                    {showDescription}
                    {showQuantity}
                    {showUses}
                    type="objectTypesPlural"
                />
            {/if}
        {/each}
    </section>
</div>
