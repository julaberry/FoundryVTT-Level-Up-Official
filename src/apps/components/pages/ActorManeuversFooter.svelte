<script>
    import { getContext } from "svelte";
    import { fade } from "svelte/transition";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import TabFooter from "../TabFooter.svelte";

    const actor = getContext("actor");

    $: exertion = $actor.system.attributes.exertion;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<TabFooter modifierClasses="a5e-tab-footer--maneuvers" --padding-right="1.5rem">
    {#if $actor.type === "character"}
        <div class="a5e-footer-field">
            <h3 class="a5e-footer-field__label">
                {localize("A5E.ExertionPool")}
            </h3>

            <div class="a5e-footer-field__values">
                <input
                    class="a5e-footer-field__input a5e-footer-field__input--maneuver"
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
                    class="a5e-footer-field__input a5e-footer-field__input--maneuver"
                    type="number"
                    name="system.attributes.exertion.max"
                    value={exertion.max}
                    placeholder="0"
                    min="0"
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

        {#if exertion.current < exertion.max && exertion.max}
            <button
                class="a5e-recharge-button"
                data-tooltip="A5E.ExertionRechargeFromHitDice"
                data-tooltip-direction="UP"
                transition:fade
                on:click={() => $actor.recoverExertionUsingHitDice()}
            >
                <i class="a5e-recharge-button__icon fa-solid fa-bolt" />
            </button>
        {/if}
    {/if}
</TabFooter>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-footer-field__input--maneuver {
        width: 2rem;
    }

    .a5e-recharge-button {
        height: 1.625rem;
        width: 1.625rem;
        padding: 0;
        margin: 0;
        background: var(--color-primary);
        color: var(--color-light-text);
        border: 1px solid #3e4240;
        border-radius: var(--border-radius-md);
        box-shadow: 0 0 6px #2e4246 inset, 0 3px 5px rgba(0, 0, 0, 0.4);

        transition: $standard-transition;

        &:hover {
            color: #e9d7a1;
        }

        &:hover,
        &:focus {
            box-shadow: 0 0 6px #2e4246 inset, 0 3px 5px rgba(0, 0, 0, 0.4);
        }

        &__icon {
            margin: 0;
        }
    }
</style>
