<script>
    import { getContext } from "svelte";

    import ArmorClass from "../actorSidebar/ArmorClass.svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import replaceHyphenWithMinusSign from "../../../utils/replaceHyphenWithMinusSign";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<ul class="a5e-ability-scores-wrapper">
    <!-- <ArmorClass /> -->
    {#each Object.entries($actor.system.abilities) as [abilityLabel, ability], i}
        <li class="a5e-ability-score">
            <header
                class="a5e-section-header a5e-section-header--ability-score"
            >
                <h3 class="a5e-section-header__heading">{abilityLabel}</h3>

                {#if !(!$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true)}
                    <button
                        on:click={() =>
                            $actor.configureAbilityScore({
                                abilityKey: abilityLabel,
                            })}
                        class="a5e-ability-score__config-button fas fa-gear"
                    />
                {/if}
            </header>

            <input
                class="a5e-ability-score__value"
                name="system.abilities.{abilityLabel}.value"
                type="number"
                value={ability.value}
                tabindex={i + 1}
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
                <div class="a5e-ability-score__roll-button-value">
                    {replaceHyphenWithMinusSign(
                        ability.check.deterministicBonus
                    )}
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
                <div class="a5e-ability-score__roll-button-value">
                    {replaceHyphenWithMinusSign(
                        ability.save.deterministicBonus
                    )}
                </div>
            </button>
        </li>
    {/each}
</ul>
