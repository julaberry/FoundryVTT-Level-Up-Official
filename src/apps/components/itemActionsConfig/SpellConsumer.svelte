<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateMode() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.mode`,
            mode
        );
    }

    function updateSpellLevel() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.spellLevel`,
            Number(spellLevel)
        );
    }

    let mode = consumer.mode ?? "variable";
    let spellLevel = consumer.spellLevel ?? 1;
    let hintToggle = false;
    $: mode, updateMode();
    $: spellLevel, updateSpellLevel();
</script>

<FormSection
    heading="A5E.Label"
    --background="none"
    --direction="column"
    --width="calc(100% - 2.5rem)"
    --padding="0"
>
    <input
        id="{actionId}-{consumerId}-label"
        name="{actionId}-{consumerId}-label"
        type="text"
        value={consumer.label ?? ""}
        on:change={() =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.label`
            )}
    />
</FormSection>

<div class="a5e-field-group u-flex-row u-gap-md">
    <FormSection
        heading="A5E.ConsumerSpellMode"
        --background="none"
        --direction="column"
        --padding="0"
    >
        <select
            name="{actionId}-{consumerId}-item-id"
            class="u-w-fit"
            bind:value={mode}
        >
            {#each Object.entries(A5E.spellConsumerModes) as [value, label]}
                <option {value} selected={mode === value}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FormSection>

    {#if ["variable", "slotsOnly"].includes(mode)}
        <FormSection
            heading="A5E.SpellLevel"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                name="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={spellLevel}
            >
                {#each Object.entries(A5E.spellLevels).slice(1) as [value, label]}
                    <option value={Number(value)}>
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </FormSection>
    {/if}

    {#if mode === "pointsOnly"}
        <FormSection
            heading="A5E.SpellPoints"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <input
                type="number"
                d-type="Number"
                value={consumer.points ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.points`,
                        Number(target.value)
                    )}
            />
        </FormSection>
    {/if}
</div>

<div class="5e-field-group">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <header
        class="u-align-center u-flex u-gap-md u-pointer u-w-fit u-mt-md"
        on:click={() => (hintToggle = !hintToggle)}
    >
        <h3 class="a5e-field-group__heading">
            {localize("A5E.ConsumerSpellModeHintTitle")}
        </h3>

        <i
            class="u-text-xs fas"
            class:fa-minus={hintToggle}
            class:fa-plus={!hintToggle}
        />
    </header>

    {#if hintToggle}
        <div class="a5e-box hint">
            <dt class="u-text-bold">Variable</dt>
            <dd class="u-m-0 u-p-0">
                Variable mode allows you to select from spell slots or spell
                points at casting time.
            </dd>

            <dt class="u-text-bold">Spell Points Only</dt>
            <dd class="u-m-0 u-p-0">
                Always consumes spells points, ignoring available spell slots.
            </dd>

            <dt class="u-text-bold">Spell Slots Only</dt>
            <dd class="u-m-0 u-p-0">
                Always consumes spell slots, ignoring available spell points.
            </dd>
        </div>
    {/if}
</div>

<style lang="scss">
    .hint {
        display: grid;
        grid-template-columns: max-content 1fr;

        column-gap: 0.75rem;
        row-gap: 0.25rem;
        font-size: $font-size-xs;
        padding: 0.5rem;
        margin-top: 0.25rem;
    }
</style>
