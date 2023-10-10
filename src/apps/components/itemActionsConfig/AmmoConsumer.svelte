<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateItemSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            selectedItem
        );
    }

    let selectedItem = consumer.itemId;
    $: selectedItem, updateItemSelection();

    $: ammunitionItems = $item.actor
        ? $item.actor.items
              .filter(
                  (i) =>
                      i.type === "object" &&
                      i.system.objectType === "ammunition"
              )
              .map((i) => ({ name: i.name, id: i.id }))
              .sort((a, b) =>
                  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              )
        : [];
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

<div class="u-flex u-gap-md">
    <FormSection
        heading="A5E.Item"
        --background="none"
        --direction="column"
        --padding="0"
    >
        {#if $item.actor}
            <select
                id="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={selectedItem}
            >
                <option value="" />
                {#each ammunitionItems as { name, id } (id)}
                    <option value={id} selected={consumer.itemId === id}>
                        {name}
                    </option>
                {/each}
            </select>
        {:else}
            <p
                class="u-w-50 a5e-field-group__hint"
                style="color: $color-warning;"
            >
                <i class="fa-solid fa-circle-exclamation" />

                Item selection will be available when item is on an actor.
            </p>
        {/if}
    </FormSection>

    <FormSection
        heading="A5E.ItemQuantity"
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
</div>
