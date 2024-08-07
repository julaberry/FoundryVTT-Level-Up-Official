<script>
    import { getContext } from "svelte";

    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import TemplatePreparationManager from "../../managers/TemplatePreparationManager";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, actionId } = getContext("#external").application;

    function getScalingOptions() {
        return [[null, "A5E.None"], ...Object.entries(CONFIG.A5E.targetScalingModes)];
    }

    const item = document;

    $: action = $item.actions[actionId];
    $: area = action.area ?? {};
    $: scalingMode = area?.scaling?.mode ?? null;

    $: properties = [
        "quantity",
        ...TemplatePreparationManager.getShapeProperties(area?.shape),
    ];
</script>

<form>
    <RadioGroup
        heading="Scaling Mode"
        options={getScalingOptions()}
        selected={scalingMode}
        allowDeselect={false}
        on:updateSelection={(event) => {
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.area.scaling.mode`,
                event.detail,
            );
        }}
    />

    {#if scalingMode === "cantrip"}
        <FieldWrapper
            hint="This increment will be applied automatically based on your caster level."
        >
            <section class="row u-flex-wrap">
                {#each properties as property}
                    <div
                        class="a5e-field-group a5e-field-group--formula a5e-field-group--spell-level"
                    >
                        <label for="{actionId}-{property}-scaling-formula">
                            {property.capitalize()} Increment
                        </label>

                        <input
                            class="a5e-input"
                            type="text"
                            name="system.actions.{actionId}.area.scaling.formula.{property}"
                            value={action.area.scaling?.formula?.[property] ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value,
                                )}
                        />
                    </div>
                {/each}
            </section>
        </FieldWrapper>
    {:else if scalingMode === "spellLevel"}
        <FieldWrapper>
            <section class="row u-flex-wrap">
                {#each properties as property}
                    <div
                        class="a5e-field-group a5e-field-group--formula a5e-field-group--spell-level"
                    >
                        <label for="{actionId}-{property}-scaling-formula">
                            {property.capitalize()} Increment
                        </label>

                        <input
                            id="{actionId}-area-scaling-formula"
                            type="text"
                            name="system.actions.{actionId}.area.scaling.formula.{property}"
                            value={area?.scaling?.formula?.[property] ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value,
                                )}
                        />
                    </div>
                {/each}

                <div class="a5e-field-group u-w-12">
                    <label for="{actionId}-area-scaling-step"> Per </label>

                    <input
                        id="{actionId}-area-scaling-step"
                        style="text-align: center;"
                        type="number"
                        name="system.actions.{actionId}.area.scaling.step"
                        value={area?.scaling?.step ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                parseInt(target.value, 10),
                            )}
                    />
                </div>

                <div class="a5e-field-group levels-wrapper">
                    <span class="levels">Levels</span>
                </div>
            </section>
        </FieldWrapper>
    {:else if ["artifactCharges", "spellPoints", "actionUses", "itemUses"].includes(scalingMode)}
        <FieldWrapper>
            <section class="row u-flex-wrap">
                {#each properties as property}
                    <div
                        class="a5e-field-group a5e-field-group--formula a5e-field-group--spell-level"
                    >
                        <label for="{actionId}-area-scaling-formula">
                            {property.capitalize()} Increment
                        </label>

                        <input
                            id="{actionId}-{property}-scaling-formula"
                            type="text"
                            name="system.actions.{actionId}.area.scaling.formula.{property}"
                            value={area?.scaling?.formula?.[property] ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value,
                                )}
                        />
                    </div>
                {/each}
                <div class="a5e-field-group u-w-12">
                    <label for="{actionId}-area-scaling-step"> Per </label>

                    <input
                        id="{actionId}-area-scaling-step"
                        style="text-align: center;"
                        type="number"
                        name="system.actions.{actionId}.area.scaling.step"
                        value={area?.scaling?.step ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                parseInt(target.value, 10),
                            )}
                    />
                </div>

                <div class="a5e-field-group levels-wrapper">
                    <span class="levels">
                        Additional {scalingMode === "spellPoints" ? "Points" : "Uses"}
                    </span>
                </div>
            </section>
        </FieldWrapper>
    {/if}
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    label {
        font-weight: bold;
        font-size: var(--a5e-text-size-sm);
    }

    input {
        height: 2rem;
        font-size: var(--a5e-text-size-sm);
    }

    .a5e-field-group--spell-level {
        gap: 0.375rem;
        width: 48%;
    }

    .levels {
        display: flex;
        align-items: center;
        height: 1.625rem;
    }

    .levels-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
