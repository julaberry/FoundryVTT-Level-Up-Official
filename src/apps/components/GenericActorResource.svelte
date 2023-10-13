<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getDeterministicBonus from "../../dice/getDeterministicBonus";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import GenericActorResourceConfigDialog from "../dialogs/initializers/GenericActorResourceConfigDialog";

    export let resource;
    export let source;

    const actor = getContext("actor");

    function configureResource() {
        const dialog = new GenericActorResourceConfigDialog(actor, source);
        dialog.render(true);
    }

    function incrementResource() {
        resource.value = Math.max(resource.value + 1, 0);
        updateDocumentDataFromField(
            $actor,
            `system.resources.${source}.value`,
            Number(resource.value)
        );
    }

    function decrementResource() {
        resource.value = Math.max(resource.value - 1, 0);
        updateDocumentDataFromField(
            $actor,
            `system.resources.${source}.value`,
            Number(resource.value)
        );
    }

    function canRecharge(_, sheetIsLocked) {
        if (!sheetIsLocked) return false;
        if (resource.per !== "recharge") return false;
        if (resource.hideMax) return true;

        const max = getDeterministicBonus(resource.max, $actor.getRollData());

        // Return false if the resource has a max value and the current value equals the max value
        return resource.value < max;
    }

    $: resource = resource;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: showRechargeButton = canRecharge($actor, sheetIsLocked);
</script>

<li class="a5e-section">
    <header class="a5e-section-header a5e-section-header--resource">
        <input
            class="a5e-section-header__heading a5e-section-header__heading--resource"
            type="text"
            name="system.resources.{source}.label"
            value={resource.label}
            placeholder={localize(`A5E.Resources${source.capitalize()}`)}
            disabled={sheetIsLocked}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />

        {#if !sheetIsLocked}
            <button class="a5e-resource-button" on:click={configureResource}>
                <i class="a5e-resource-button__icon fas fa-gear" />
            </button>
        {/if}

        {#if showRechargeButton}
            <button
                class="a5e-resource-button"
                data-tooltip="Recharge Resource"
                data-tooltip-direction="UP"
                on:click={() => $actor.rechargeGenericResource(source)}
            >
                <i class="a5e-resource-button__icon fas fa-dice" />
            </button>
        {/if}
    </header>

    <div class="a5e-resource-values-wrapper">
        {#if resource.hideMax}
            <button
                class="a5e-resource-increment-button fas fa-minus"
                type="button"
                disabled={resource.value === 0}
                on:click={decrementResource}
            />
        {/if}

        <input
            class="a5e-resource-input"
            class:disable-pointer-events={!$actor.isOwner}
            type="number"
            name="system.resources.{source}.value"
            value={resource.value}
            placeholder="0"
            min="0"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />

        {#if resource.hideMax}
            <button
                class="a5e-resource-increment-button fas fa-plus"
                type="button"
                on:click={({ target }) => {
                    incrementResource();
                    target.blur();
                }}
            />
        {:else}
            <span class="resource-seperator"> / </span>

            <input
                class="a5e-resource-input"
                type="number"
                name="system.resources.{source}.max"
                value={getDeterministicBonus(
                    resource.max ?? 0,
                    $actor.getRollData()
                )}
                placeholder="0"
                disabled
            />
        {/if}
    </div>
</li>

<style lang="scss">
    .a5e-resource-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        color: rgba(255, 255, 255, 0.5);
        background: transparent;

        transition: all 0.15s ease-in-out;

        &:hover {
            box-shadow: none;
            color: var(--color-light-text);
            transform: scale(1.2);
        }

        &__icon {
            margin: 0;
            line-height: 1;
        }
    }

    .a5e-resource-increment-button {
        height: 100%;
        margin: 0;
        padding: 0;
        opacity: 0.8;
        background: transparent;
        color: var(--color-text);

        transition: all 0.15s ease-in-out;

        &:focus,
        &:hover {
            box-shadow: none;
            opacity: 1;
            transform: scale(1.2);
        }
    }

    .a5e-resource-input {
        border: 0;
        border-radius: 0;
        background: transparent;
        text-align: center;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .a5e-resource-values-wrapper {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        height: 1.5rem;
    }

    .disable-pointer-events {
        pointer-events: none;
    }
</style>
