<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags?.a5e;

    $: disableMeleeSpellAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.meleeSpellAttack"
    );

    $: disableMeleeWeaponAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.meleeWeaponAttack"
    );

    $: disableRangedSpellAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.rangedSpellAttack"
    );

    $: disableRangedWeaponAttack = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.rangedWeaponAttack"
    );

    $: disableAbilityCheckBonusGlobal = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.abilities.check"
    );

    $: disableSavingThrowBonusGlobal = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.abilities.save"
    );

    $: disableSkillCheckBonusGlobal = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.abilities.skill"
    );
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Global Attack Bonuses</h3>
        </header>

        <FormSection
            heading="Melee Weapon Attack"
            showWarning={disableMeleeWeaponAttack}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.meleeWeaponAttack"
                value={$actor.system.bonuses.meleeWeaponAttack}
                disabled={disableMeleeWeaponAttack}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>

        <FormSection
            heading="Ranged Weapon Attack"
            showWarning={disableRangedWeaponAttack}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.rangedWeaponAttack"
                value={$actor.system.bonuses.rangedWeaponAttack}
                disabled={disableRangedWeaponAttack}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>

        <FormSection
            heading="Melee Spell Attack"
            showWarning={disableMeleeSpellAttack}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.meleeSpellAttack"
                value={$actor.system.bonuses.meleeSpellAttack}
                disabled={disableMeleeSpellAttack}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>

        <FormSection
            heading="Ranged Spell Attack"
            showWarning={disableRangedSpellAttack}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.rangedSpellAttack"
                value={$actor.system.bonuses.rangedSpellAttack}
                disabled={disableRangedSpellAttack}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>
    </div>

    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Global Check Bonuses</h3>
        </header>

        <FormSection
            heading="A5E.AbilityCheckBonusGlobal"
            showWarning={disableAbilityCheckBonusGlobal}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.abilities.check"
                value={$actor.system.bonuses.abilities.check}
                disabled={disableAbilityCheckBonusGlobal}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>

        <FormSection
            heading="A5E.SavingThrowBonusGlobal"
            showWarning={disableSavingThrowBonusGlobal}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.abilities.save"
                value={$actor.system.bonuses.abilities.save}
                disabled={disableSavingThrowBonusGlobal}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>

        <FormSection
            heading="A5E.SkillCheckBonusGlobal"
            showWarning={disableSkillCheckBonusGlobal}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="rgba(255, 255, 255, 0.1)"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.abilities.skill"
                value={$actor.system.bonuses.abilities.skill}
                disabled={disableSkillCheckBonusGlobal}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </FormSection>
    </div>

    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Sheet Customization</h3>
        </header>

        <FormSection --background="rgba(255, 255, 255, 0.1)">
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

        <FormSection --background="rgba(255, 255, 255, 0.1)">
            <Checkbox
                label="A5E.settings.includeAbilityModifiersForSkills"
                checked={flags.a5e?.includeAbilityModifiersForSkills ??
                    $actor.type === "npc"}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.includeAbilityModifiersForSkills",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection --background="rgba(255, 255, 255, 0.1)">
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

        <FormSection --background="rgba(255, 255, 255, 0.1)">
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

        <FormSection --background="rgba(255, 255, 255, 0.1)">
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

        <FormSection --background="rgba(255, 255, 255, 0.1)">
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
            <FormSection --background="rgba(255, 255, 255, 0.1)">
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
    </div>
</section>
