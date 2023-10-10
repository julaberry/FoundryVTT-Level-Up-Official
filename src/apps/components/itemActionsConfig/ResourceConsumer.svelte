<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateResourceSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.resource`,
            selectedResource
        );
    }

    let selectedResource = consumer.resource ?? "";
    $: selectedResource, updateResourceSelection();
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

<div class="a5e-field-group u-flex-row u-gap-lg">
    <FormSection
        heading="A5E.Resource"
        --background="none"
        --direction="column"
        --padding="0"
    >
        <select
            name="{actionId}-{consumerId}-item-id"
            class="u-w-fit"
            bind:value={selectedResource}
        >
            <option value="" />

            {#each Object.entries(A5E.resourceConsumerConfig) as [value, { label }] (value)}
                <option {value}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FormSection>

    {#if A5E.resourceConsumerConfig?.[selectedResource]?.type === "value"}
        <FormSection
            heading="A5E.ConsumeValue"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <input
                type="number"
                d-type="Number"
                value={consumer.quantity ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.quantity`,
                        Number(target.value)
                    )}
            />
        </FormSection>
    {/if}

    {#if A5E.resourceConsumerConfig?.[selectedResource]?.type === "boolean"}
        <FormSection
            --item-justification="flex-end"
            --background="none"
            --margin="0 0 0 0.5rem"
            --padding="0.25rem 0 0.125rem 0"
        >
            <Checkbox
                label="A5E.ConsumerRestoreResourceOnUse"
                checked={consumer.restore ?? false}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.restore`,
                        detail
                    )}
            />
        </FormSection>
    {/if}
</div>
