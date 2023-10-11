<script>
    import { localize } from "#runtime/svelte/helper";

    export let carryCapacity;
    export let encumbrancePercentage;
    export let inventoryWeight;
</script>

<div class="a5e-encumbrance-track">
    <div class="a5e-encumbrance-track__bar">
        <div class="a5e-encumbrance-track__values">
            <span>
                {inventoryWeight?.toFixed(1)}
                {localize("A5E.MeasurementPoundsAbbr")}
            </span>

            /

            <span>
                {carryCapacity}
                {localize("A5E.MeasurementPoundsAbbr")}
            </span>

            {#if encumbrancePercentage === 100}
                <span>
                    {localize("A5E.ConditionEncumbered")}
                </span>
            {/if}
        </div>
    </div>
</div>
