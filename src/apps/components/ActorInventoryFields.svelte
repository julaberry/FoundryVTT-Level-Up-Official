<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    function getBulkyLimit(actor) {
        const { supply } = actor.system;

        if (supply) {
            return Math.max(1 + actor.system.abilities.str.mod, 1);
        }

        return Math.max(2 + actor.system.abilities.str.mod, 2);
    }

    function getSupplyLimit(actor) {
        return actor.system.abilities.str.value;
    }

    $: bulkyItems = $actor.items.reduce((bulkyCount, item) => {
        if (item.system.bulky) bulkyCount += 1;
        return bulkyCount;
    }, 0);

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: attunement = $actor.system.attributes.attunement;
    $: bulkyLimit = getBulkyLimit($actor);
    $: supply = $actor.system.supply;
    $: supplyLimit = getSupplyLimit($actor);
</script>

{#if $actor.type === "character"}
    <!-- Attunement -->
    <div
        class="a5e-footer-field a5e-footer-field--attunement"
        class:a5e-footer-field--stacked={$actor.flags?.a5e
            ?.trackInventoryWeight ?? true}
    >
        <h3 class="a5e-footer-field__label">
            {localize("A5E.Attunement")}
        </h3>

        <div class="a5e-footer-field__values">
            <span class="a5e-footer-field__input">
                {attunement.current}
            </span>
            /
            <input
                class="a5e-footer-field__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.attunement.max"
                value={attunement.max}
                placeholder="0"
                min="0"
                max="9"
                disabled={sheetIsLocked}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
            />
        </div>
    </div>

    <!-- Supply -->
    <div
        class="a5e-footer-field a5e-footer-field--supply"
        class:a5e-footer-field--stacked={$actor.flags?.a5e
            ?.trackInventoryWeight ?? true}
    >
        <h3 class="a5e-footer-field__label">
            {localize("A5E.Supply")}
        </h3>

        <div class="a5e-footer-field__values">
            <input
                class="a5e-footer-field__input a5e-footer-field__input--supply"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.supply"
                value={supply}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
            />
            /
            <span
                class="a5e-footer-field__input a5e-footer-field__input--supply"
            >
                {supplyLimit}
            </span>
        </div>
    </div>

    <div class="a5e-footer-field a5e-footer-field--bulky">
        <h3 class="a5e-footer-field__label">Bulky</h3>

        <div class="a5e-footer-field__values">
            <span class="a5e-footer-field__input">
                {bulkyItems}
            </span>
            /
            <span class="a5e-footer-field__input">
                {bulkyLimit}
            </span>
        </div>
    </div>
{/if}

<style lang="scss">
    .a5e-footer-field--attunement {
        grid-area: attunement;
    }

    .a5e-footer-field--bulky {
        grid-area: bulky;
    }

    .a5e-footer-field--supply {
        grid-area: supply;
    }

    .a5e-footer-field__input--supply {
        width: 2rem;
        text-align: center;
    }

    .disable-pointer-events {
        pointer-events: none;
    }
</style>
