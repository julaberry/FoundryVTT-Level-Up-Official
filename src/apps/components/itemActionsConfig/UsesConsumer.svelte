<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
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
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
                target.value
            )}
    />
</FormSection>

<FormSection
    heading="Default Consumption Amount"
    --background="none"
    --direction="column"
    --width="max-content"
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
