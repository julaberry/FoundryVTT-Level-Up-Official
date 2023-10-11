<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import TabFooter from "../TabFooter.svelte";

    const actor = getContext("actor");

    $: exertion = $actor.system.attributes.exertion;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<TabFooter --padding-right="1.5rem">
    {#if $actor.type === "character"}
        <div class="u-flex u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-sm u-text-bold">
                {localize("A5E.ExertionPool")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.exertion.current"
                value={exertion.current}
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
            <input
                class="a5e-footer-group__input"
                type="number"
                name="system.attributes.exertion.max"
                value={exertion.max}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
            />

            {#if exertion.current < exertion.max && exertion.max}
                <button
                    class="recharge-button"
                    data-tooltip="A5E.ExertionRechargeFromHitDice"
                    data-tooltip-direction="UP"
                    on:click={() => $actor.recoverExertionUsingHitDice()}
                >
                    <i class="fa-solid fa-bolt" />
                </button>
            {/if}
        </div>
    {/if}

    {#if !sheetIsLocked}
        <div class="u-flex u-align-center u-gap-md u-ml-auto">
            <h3 class="u-mb-0 u-text-sm u-text-bold">
                {localize("A5E.ConfigureManeuvers")}
            </h3>

            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <i
                class="fas fa-gear a5e-config-button"
                on:click={() => $actor.configureManeuvers()}
            />
        </div>
    {/if}
</TabFooter>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .recharge-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0;
        margin: 0;
        margin-left: 0.25rem;
        background: none;
        color: #999;
        border: 0;

        transition: $standard-transition;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }
</style>
