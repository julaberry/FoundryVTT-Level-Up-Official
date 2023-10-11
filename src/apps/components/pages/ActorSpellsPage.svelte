<script>
    import { getContext, onDestroy } from "svelte";

    import usesRequired from "../../../utils/usesRequired";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";

    const actor = getContext("actor");
    const { spells } = actor;
    const { spellLevels } = CONFIG.A5E;
    const reducerType = "spells";

    $: menuList = Object.entries(spellLevels);

    $: preparedSpellCount = $actor.items.filter((item) => {
        if (item.type !== "spell") return false;
        if (
            !item.system.prepared ||
            item.system.prepared === CONFIG.A5E.PREPARED_STATES.ALWAYS_PREPARED
        )
            return false;

        return true;
    }).length;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: isSpellLevelVisible = (level) => {
        if (!sheetIsLocked) return true;

        const maxSlots = $actor.system.spellResources.slots[level]?.max;
        const showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
        const spellQuantity = [...$spells._levels[level]].length;

        if (spellQuantity) return true;
        if (showSpellSlots && maxSlots > 0) return true;

        return false;
    };

    let showDescription = false;
    let showUses = false;

    const unsubscribe = spells.subscribe((_) => {
        showUses = usesRequired(spells);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div
    class="a5e-page-wrapper"
    class:a5e-page-wrapper--has-footer={preparedSpellCount ||
        ($actor.flags.a5e?.showSpellPoints ?? false) ||
        $actor.type === "npc" ||
        !sheetIsLocked}
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

    <section class="a5e-item-list-wrapper">
        {#each Object.entries(spellLevels) as [level, label]}
            {#if isSpellLevelVisible(level)}
                <ItemCategory
                    {level}
                    {label}
                    {showDescription}
                    {showUses}
                    items={$spells._levels[level]}
                    type="spellLevels"
                />
            {/if}
        {/each}
    </section>
</div>
