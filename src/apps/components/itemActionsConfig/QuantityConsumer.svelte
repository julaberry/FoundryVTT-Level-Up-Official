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

    function updateItemSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            selectedItem
        );
    }

    let selectedItem = consumer.itemId ?? "";

    $: selectedItem, updateItemSelection();

    $: optGroup = $item.actor
        ? $item.actor.items.reduce((acc, i) => {
              if (i.type !== "object") return acc;
              if (i.system.objectType === "ammunition") return acc;

              const type = i.system.objectType;
              const data = {
                  name: i.name,
                  id: i.id,
              };

              if (acc?.[type]) acc[type].push(data);
              else acc[type] = [data];

              return acc;
          }, {})
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

<div class="a5e-field-group u-flex-row u-gap-md">
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
                {#each Object.entries(optGroup) as [type, objects]}
                    <optgroup label={localize(A5E.objectTypesPlural[type])}>
                        {#each objects.sort((a, b) => a.name
                                .toLowerCase()
                                .localeCompare(b.name.toLowerCase())) as { name, id } (id)}
                            <option value={id} selected={consumer.itemId}>
                                {name}
                            </option>
                        {/each}
                    </optgroup>
                {/each}
            </select>
        {:else}
            <p class="a5e-field-group__hint" style="color: $color-warning;">
                <i class="fa-solid fa-circle-exclamation" />

                Item selection will be available when item is on an actor.
            </p>
        {/if}
    </FormSection>

    {#if $item.actor}
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
    {/if}
</div>
