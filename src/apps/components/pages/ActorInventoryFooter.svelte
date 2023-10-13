<script>
    import { getContext } from "svelte";

    import ActorInventoryFields from "../ActorInventoryFields.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import TabFooter from "../TabFooter.svelte";

    import calculateCarryCapacity from "../../handlers/calculateCarryCapacity";
    import calculateInventoryWeight from "../../handlers/calculateInventoryWeight";

    function getBulkyLimit(actor) {
        const { supply } = actor.system;

        if (supply) {
            return Math.max(1 + actor.system.abilities.str.mod, 1);
        }

        return Math.max(2 + actor.system.abilities.str.mod, 2);
    }

    const actor = getContext("actor");

    $: bulkyItems = $actor.items.reduce((bulkyCount, item) => {
        if (item.system.bulky) bulkyCount += 1;
        return bulkyCount;
    }, 0);

    $: bulkyLimit = getBulkyLimit($actor);
    $: carryCapacity = calculateCarryCapacity($actor);
    $: inventoryWeight = calculateInventoryWeight($actor);

    $: encumbrancePercentage = Math.min(
        (inventoryWeight / carryCapacity) * 100,
        100
    );
</script>

<TabFooter
    modifierClasses={$actor.flags?.a5e?.trackInventoryWeight ?? true
        ? "a5e-tab-footer--inventory"
        : "a5e-tab-footer--inventory-alt"}
>
    {#if $actor.flags?.a5e?.trackInventoryWeight ?? true}
        <ItemWeightTrack
            {carryCapacity}
            {inventoryWeight}
            {encumbrancePercentage}
            --bar-width={`${Math.min(encumbrancePercentage, 100)}%`}
            --encumbrance-bar-color={encumbrancePercentage === 100
                ? "var(--color-secondary)"
                : "var(--color-primary)"}
        />
    {/if}

    <ActorInventoryFields />
</TabFooter>
