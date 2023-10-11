<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import TabFooter from "../TabFooter.svelte";

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: spellResources = $actor.system.spellResources;

    $: preparedSpellCount = $actor.items.filter((item) => {
        if (item.type !== "spell") return false;
        if (
            !item.system.prepared ||
            item.system.prepared === CONFIG.A5E.PREPARED_STATES.ALWAYS_PREPARED
        )
            return false;

        return true;
    }).length;
</script>

{#if preparedSpellCount || ($actor.flags.a5e?.showSpellPoints ?? false) || $actor.type === "npc" || !sheetIsLocked}
    <TabFooter
        modifierClasses="a5e-tab-footer--spells"
        --padding-right="1.5rem"
    >
        <!-- NPC Caster Level Configuration -->
        {#if $actor.type === "npc"}
            <div class="a5e-footer-field">
                <h3 class="a5e-footer-field__label">
                    {localize("A5E.CasterLevel")}
                </h3>

                <div class="a5e-footer-field__values">
                    <input
                        class="a5e-footer-field__input a5e-footer-field__input--spell"
                        class:disable-pointer-events={!$actor.isOwner ||
                            sheetIsLocked}
                        type="number"
                        name="system.attributes.casterLevel"
                        value={$actor.system.attributes.casterLevel}
                        placeholder="0"
                        min="0"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value)
                            )}
                    />
                </div>
            </div>
        {/if}

        <!-- Prepared Spells Count -->
        {#if preparedSpellCount}
            <div
                class="a5e-footer-field"
                data-tooltip="This number does not include spells which are marked as always prepared."
                data-tooltip-direction="UP"
            >
                <h3 class="a5e-footer-field__label">Spells Prepared</h3>

                <div class="a5e-footer-field__values">
                    <span
                        class="a5e-footer-field__input a5e-footer-field__input--spell"
                    >
                        {preparedSpellCount}
                    </span>
                </div>
            </div>
        {/if}

        <!-- Spell Points -->
        {#if $actor.flags.a5e?.showSpellPoints ?? false}
            <div class="a5e-footer-field">
                <h3 class="a5e-footer-field__label">
                    {localize("A5E.SpellPoints")}
                </h3>

                <div class="a5e-footer-field__values">
                    <input
                        class="a5e-footer-field__input a5e-footer-field__input--spell"
                        class:disable-pointer-events={!$actor.isOwner}
                        type="number"
                        name="system.spellResources.points.current"
                        value={spellResources.points.current}
                        placeholder="0"
                        min="0"
                        max="99"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value)
                            )}
                    />
                    /
                    <input
                        class="a5e-footer-field__input a5e-footer-field__input--spell"
                        class:disable-pointer-events={!$actor.isOwner}
                        type="number"
                        name="system.spellResources.points.max"
                        value={spellResources.points.max}
                        placeholder="0"
                        min="0"
                        max="99"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value)
                            )}
                    />
                </div>
            </div>
        {/if}
    </TabFooter>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-footer-field__input--spell {
        width: 2rem;
    }
</style>
