<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ActorGeneralSettingsTab from "./ActorGeneralSettingsTab.svelte";
    import ActorInventorySettingsTab from "./ActorInventorySettingsTab.svelte";
    import ActorManeuverSettingsTab from "./ActorManeuverSettingsTab.svelte";
    import ActorRollSettingsTab from "./ActorRollSettingsTab.svelte";
    import ActorSpellSettingsTab from "./ActorSpellSettingsTab.svelte";
    import SecondaryNavigationBar from "../navigation/SecondaryNavigationBar.svelte";
    import ActorNpcSettingsTab from "./ActorNPCSettingsTab.svelte";

    import ActorSheetTempSettingsStore from "../../../stores/ActorSheetTempSettingsStore";

    function updateCurrentTab({ detail: name }) {
        const { uuid } = $actor;
        currentTab = name;

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                ...(currentSettings[uuid] ?? {}),
                currentSettingsTab: name,
            },
        }));
    }

    function getDamageBonusSummary(damageBonus) {
        const { damageBonusSummariesByContext, damageTypes } = CONFIG.A5E;
        const damageType = damageTypes[damageBonus.damageType];

        return localize(damageBonusSummariesByContext[damageBonus.context], {
            formula: damageBonus.formula,
            damageType: damageType
                ? `${damageType.toLowerCase()} damage`
                : "damage",
        });
    }

    function getHealingBonusSummary(healingBonus) {
        const { healingBonusSummariesByContext, healingTypes } = CONFIG.A5E;
        const healingType = healingTypes[healingBonus.healingType];

        return localize(healingBonusSummariesByContext[healingBonus.context], {
            formula: healingBonus.formula,
            healingType: healingType
                ? `${healingType.toLowerCase()} healing`
                : "healing",
        });
    }

    let tempSettings = {};

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    const actor = getContext("actor");

    const tabs = {
        general: {
            component: ActorGeneralSettingsTab,
            label: "General",
        },
        inventory: {
            component: ActorInventorySettingsTab,
            label: "Inventory",
        },
        maneuvers: {
            component: ActorManeuverSettingsTab,
            label: "Maneuvers",
            display: $actor.type === "character",
        },
        spells: {
            component: ActorSpellSettingsTab,
            label: "Spells",
        },
        rolls: {
            component: ActorRollSettingsTab,
            label: "Rolls",
            display: $actor.type === "character",
        },
        npc: {
            component: ActorNpcSettingsTab,
            label: "NPC Options",
            display:
                $actor.type === "npc" &&
                (game.settings.get("a5e", "randomizeNPCHitPoints") ?? true),
        },
    };

    let currentTab =
        tempSettings[$actor?.uuid]?.currentSettingsTab ?? "general";
</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

<svelte:component this={tabs[currentTab]?.component} />

<!--
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Damage Bonuses</h3>

            <button
                class="setting-header-button"
                on:click={() => $actor.addBonus("damage")}
            >
                + Add Damage Bonus
            </button>
        </header>

        <ul class="bonus-list">
            {#each Object.entries($actor.system.bonuses.damage ?? {}) as [id, damageBonus] (id)}
                <li class="bonus">
                    <header class="bonus__header">
                        <h3 class="bonus__heading">
                            {damageBonus.label || "New Damage Bonus"}
                        </h3>

                        <ul class="bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.configureBonus(id, "damage")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.duplicateBonus(id, "damage")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.deleteBonus(id, "damage")}
                                />
                            </li>
                        </ul>
                    </header>

                    {#if damageBonus.formula}
                        <p class="bonus__summary">
                            {getDamageBonusSummary(damageBonus)}
                        </p>
                    {/if}
                </li>
            {/each}
        </ul>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Healing Bonuses</h3>

            <button
                class="setting-header-button"
                on:click={() => $actor.addBonus("healing")}
            >
                + Add Healing Bonus
            </button>
        </header>

        <ul class="bonus-list">
            {#each Object.entries($actor.system.bonuses.healing ?? {}) as [id, healingBonus] (id)}
                <li class="bonus">
                    <header class="bonus__header">
                        <h3 class="bonus__heading">
                            {healingBonus.label || "New Healing Bonus"}
                        </h3>

                        <ul class="bonus-buttons">
                            <li>
                                <button
                                    class="action-button fas fa-cog"
                                    data-tooltip="A5E.ButtonToolTipConfigure"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.configureBonus(id, "healing")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button fa-solid fa-clone"
                                    data-tooltip="A5E.ButtonToolTipDuplicate"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.duplicateBonus(id, "healing")}
                                />
                            </li>

                            <li>
                                <button
                                    class="action-button delete-button fas fa-trash"
                                    data-tooltip="A5E.ButtonToolTipDelete"
                                    data-tooltip-direction="UP"
                                    on:click|stopPropagation={() =>
                                        $actor.deleteBonus(id, "healing")}
                                />
                            </li>
                        </ul>
                    </header>

                    {#if healingBonus.formula}
                        <p class="bonus__summary">
                            {getHealingBonusSummary(healingBonus)}
                        </p>
                    {/if}
                </li>
            {/each}
        </ul>
    </section>

    <section class="setting-group">
        <header class="a5e-section-header a5e-section-header--rounded">
            <h3 class="a5e-section-header__heading">Sheet Customization</h3>
        </header>

        <FormSection>
            <Checkbox
                label="A5E.HideGenericResources"
                checked={flags.a5e?.hideGenericResources ??
                    $actor.type === "npc"}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.hideGenericResources",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.includeAbilityModifiersForSkills"
                checked={flags.a5e?.includeAbilityModifiersForSkills ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.includeAbilityModifiersForSkills",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showFavoritesSection"
                checked={flags.a5e?.showFavoritesSection ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showFavoritesSection",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showManeuverTab"
                checked={flags.a5e?.showManeuverTab ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showManeuverTab",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showPassiveScores"
                checked={flags.a5e?.showPassiveScores ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showPassiveScores",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showSpellTab"
                checked={flags.a5e?.showSpellTab ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellTab",
                        detail
                    );
                }}
            />
        </FormSection>

        {#if $actor.type === "character"}
            <FormSection>
                <Checkbox
                    label="A5E.settings.showXP"
                    checked={flags.a5e?.showXP ?? true}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.showXP",
                            detail
                        );
                    }}
                />
            </FormSection>
        {/if}
    </section>
</section> -->

<style lang="scss">
    .action-button {
        padding: 0.25rem;
        color: #999;
        border: 0;
        background: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

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

    .delete-button:hover {
        color: $color-secondary;
    }

    .bonus-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .bonus {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: $border-radius-standard;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__heading {
            font-size: $font-size-sm;
        }

        &__summary {
            font-size: $font-size-xs;
        }
    }

    .bonus-buttons {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .global-bonus-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
    }
</style>
