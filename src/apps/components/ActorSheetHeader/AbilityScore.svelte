<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import replaceHyphenWithMinusSign from "../../../utils/replaceHyphenWithMinusSign";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let ability;
    export let abilityLabel;
    export let idx;

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="a5e-ability-score">
    <header class="a5e-section-header a5e-section-header--ability-score">
        <h3 class="a5e-section-header__heading">{abilityLabel}</h3>
    </header>

    <input
        class="a5e-ability-score__value"
        name="system.abilities.{abilityLabel}.value"
        type="number"
        value={ability.value}
        tabindex={idx + 1}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
        placeholder="10"
        disabled={sheetIsLocked}
    />

    <button
        class="a5e-ability-score__roll-button a5e-ability-score__roll-button--check"
        data-tooltip="A5E.RollAbilityCheck"
        data-tooltip-direction="DOWN"
        on:click={() =>
            $actor.rollAbilityCheck(
                abilityLabel,
                getKeyPressAsOptions($pressedKeysStore)
            )}
    >
        <!-- <h4 class="a5e-ability-score__roll-button-label">Check</h4> -->

        <div class="a5e-ability-score__roll-button-value">
            {replaceHyphenWithMinusSign(ability.check.deterministicBonus)}
        </div>
    </button>

    <button
        class="a5e-ability-score__roll-button a5e-ability-score__roll-button--save"
        data-tooltip="A5E.RollSavingThrow"
        data-tooltip-direction="DOWN"
        on:click={() =>
            $actor.rollSavingThrow(
                abilityLabel,
                getKeyPressAsOptions($pressedKeysStore)
            )}
    >
        <!-- <h4 class="a5e-ability-score__roll-button-label">Save</h4> -->

        <div class="a5e-ability-score__roll-button-value">
            {replaceHyphenWithMinusSign(ability.save.deterministicBonus)}
        </div>
    </button>

    {#if !(!$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true)}
        <button
            on:click={() =>
                $actor.configureAbilityScore({ abilityKey: abilityLabel })}
            class="fas fa-gear a5e-button--edit-config"
        />
    {/if}
</li>

<style lang="scss">
    .ability-score {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
        width: 100%;
        color: $color-light-text;
        border-radius: $border-radius-standard;
        gap: 0.25rem;
        overflow: hidden;

        &__main {
            grid-column: span 2;
            text-transform: uppercase;

            h3 {
                font-family: var(--font-serif);
                font-size: var(--font-size-sm);
            }
        }

        &__value {
            display: flex;
            align-items: center;
            height: 26px;
            margin-bottom: 0;
            font-family: var(--font-serif);
            font-size: var(--font-size-lg);
            font-weight: inherit;
            text-align: center;
            color: $color-dark-text;
            background: none;
            border: 0;

            &:focus {
                box-shadow: none;
            }

            &::placeholder {
                color: lighten($color-dark-text, 35%);
            }
        }
    }

    .ability-score__main,
    .roll-button {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0.125rem 0;
        margin: 0;
        font-family: $font-primary;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: $color-light-background;
        box-shadow: 0 0 5px #ccc inset;
        line-height: unset;
    }

    .roll-button {
        width: min-content;
        cursor: pointer;

        &__label {
            font-size: $font-size-xs;
        }

        &__value {
            color: $color-dark-text;
        }
    }

    .a5e-button--edit-config {
        top: 0.25rem;
        right: 0.25rem;
    }
</style>
