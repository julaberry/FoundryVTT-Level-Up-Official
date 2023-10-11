<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ActorInventoryFields from "../ActorInventoryFields.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import TabFooter from "../TabFooter.svelte";

    import calculateCarryCapacity from "../../handlers/calculateCarryCapacity";
    import calculateInventoryWeight from "../../handlers/calculateInventoryWeight";

    const actor = getContext("actor");

    $: carryCapacity = calculateCarryCapacity($actor);
    $: inventoryWeight = calculateInventoryWeight($actor);

    $: encumbrancePercentage = Math.min(
        (inventoryWeight / carryCapacity) * 100,
        100
    );

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<TabFooter modifierClasses="a5e-tab-footer--inventory">
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
