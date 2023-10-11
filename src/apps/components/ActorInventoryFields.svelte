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
    $: currency = $actor.system.currency;
    $: supply = $actor.system.supply;
    $: supplyLimit = getSupplyLimit($actor);
</script>

{#if $actor.type === "character"}
    <!-- Attunement -->
    <div class="a5e-footer-field">
        <h3 class="a5e-footer-field__label">{localize("A5E.Attunement")}</h3>

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
    <div class="a5e-footer-field">
        <h3 class="a5e-footer-field__label">{localize("A5E.Supply")}</h3>

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

    <!-- Bulky Items -->
    <div class="a5e-footer-field">
        <h3 class="a5e-footer-field__label">{localize("Bulky Items")}</h3>

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

<!-- Currencies -->
<!-- <div
        class="
		u-flex u-gap-sm u-text-sm
		shield
		shield--currency
	"
        class:u-ml-auto={$actor.type === "npc"}
        class:u-mr-auto={$actor.type === "npc"}
    >
        <ol class="currency__list">
            {#each Object.entries(currency) as [label, value]}
                <li class="currency__item" data-type={label}>
                    <label
                        class="currency__label"
                        class:disable-pointer-events={!$actor.isOwner}
                        for="currency-{label}"
                    >
                        {localize(label)}
                    </label>

                    <input
                        class="a5e-footer-group__input a5e-footer-group__input--currency shield-input"
                        class:disable-pointer-events={!$actor.isOwner}
                        id="currency-{label}"
                        type="number"
                        name="system.currency.{label}"
                        {value}
                        min="0"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value)
                            )}
                    />
                </li>
            {/each}
        </ol>
    </div> -->

<style lang="scss">
    .a5e-footer-field__input--supply {
        width: 2rem;
        text-align: center;
    }

    .currency {
        &__item {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
        }

        &__label {
            margin-bottom: 0;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
        }

        &__list {
            display: flex;
            gap: 0.25rem;
            margin: 0;
            padding: 0;
            list-style: none;
        }
    }

    .disable-pointer-events {
        pointer-events: none;
    }
</style>
