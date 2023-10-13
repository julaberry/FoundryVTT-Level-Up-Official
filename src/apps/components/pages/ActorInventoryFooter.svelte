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

    const fieldType = template[key].constructor;

    if (fieldType === fields.SchemaField) {
        const mergedFields = this.mergeSchema(
            schema[key].fields,
            template[key].fields
        );

        Object.values(mergedFields).forEach((field) => {
            field.parent = undefined;
        });
        schema[key] = new fields.SchemaField(mergedFields, mergeOptions);
    }

    // Comment 1
    else if (fieldType === fields.ArrayField || fieldType === fields.SetField) {
        const elemOptions = foundry.utils.mergeObject(
            schema[key].element.options,
            template[key].element.options
        );

        const ElemType = (template[key].element || schema[key].element)
            .constructor;

        schema[key] = new template[key].constructor(
            new ElemType(elemOptions),
            mergeOptions
        );
    }

    // Comment 2
    else {
        schema[key] = new template[key].constructor(mergeOptions);
    }
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
