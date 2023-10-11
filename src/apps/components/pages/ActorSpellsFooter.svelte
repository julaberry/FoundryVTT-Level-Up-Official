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
    <TabFooter --padding-right="1.5rem">
        <!-- Prepared Spells Count -->
        {#if preparedSpellCount}
            <div
                class="u-flex u-flex-wrap u-align-center u-gap-md"
                data-tooltip="This number does not include spells which are marked as always prepared."
                data-tooltip-direction="UP"
            >
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    Spells Prepared:
                </h3>

                <span class="a5e-footer-group__input">{preparedSpellCount}</span
                >
            </div>
        {/if}

        <!-- Spell Points -->
        {#if $actor.flags.a5e?.showSpellPoints ?? false}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.SpellPoints")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!$actor.isOwner}
                    type="number"
                    name="system.spellResources.points.current"
                    value={spellResources.points.current}
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
                    name="system.spellResources.points.max"
                    value={spellResources.points.max}
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
        {/if}

        <!-- NPC Caster Level Configuration -->
        {#if $actor.type === "npc"}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.CasterLevel")}
                </h3>

                <input
                    class="a5e-footer-group__input"
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
        {/if}

        {#if !sheetIsLocked}
            <div
                class="u-align-center u-flex u-gap-md u-h-6"
                class:u-ml-auto={!$actor.flags.a5e?.showSpellPoints ?? true}
            >
                <h3 class="u-mb-0 u-text-bold u-text-sm">
                    {localize("A5E.ConfigureSpells")}
                </h3>

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <i
                    class="fas fa-gear a5e-config-button u-text-sm"
                    on:click={() => $actor.configureSpellTab()}
                />
            </div>
        {/if}
    </TabFooter>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }
</style>
