<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import DropArea from "../dropAreas/DropArea.svelte";
    import DropTag from "../DropTag.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import GrantConfig from "./GrantConfig.svelte";

    export let { document, grantId, grantType } = getContext("#external").application;

    function updateImage() {
        const current = grant?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    function onUpdateValue(key, value) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    function onDropUpdate(key, value) {
        if (key === "items.base") {
            if (baseUuids.includes(value)) return;

            const updateArray = [...(grant.items.base ?? [])];
            const doc = fromUuidSync(value);
            updateArray.push({ uuid: value, quantity: doc.system.quantity });
            onUpdateValue(key, updateArray);
        }

        if (key === "items.options") {
            if (optionalUuids.includes(value)) return;

            const updateArray = [...(grant.items.options ?? [])];
            const doc = fromUuidSync(value);
            updateArray.push({ uuid: value, quantity: doc.system.quantity });
            onUpdateValue(key, updateArray);
        }
    }

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);

    $: grant = $item.system.grants[grantId];
    $: baseUuids = grant.items.base.map((i) => i.uuid) ?? [];
    $: optionalUuids = grant.items.options.map((i) => i.uuid) ?? [];

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            on:click={updateImage}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={grant.label ?? ""}
                class="grant-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section heading="Base Items" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) => onDropUpdate("items.base", detail.uuid)}
        />

        <DropTag
            embeddedData={grant.items.base}
            type="item"
            on:updateSelection={({ detail }) => onUpdateValue("items.base", detail)}
        />
    </Section>

    <Section heading="Optional Items" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) =>
                onDropUpdate("items.options", detail.uuid)}
        />

        <DropTag
            embeddedData={grant.items.options}
            type="item"
            on:updateSelection={({ detail }) => onUpdateValue("items.options", detail)}
        />
    </Section>

    <GrantConfig>
        <FieldWrapper heading="Total Count">
            <input
                type="number"
                value={grant.items.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("items.total", Number(target.value))}
            />
        </FieldWrapper>
    </GrantConfig>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.75rem;
        background: var(--background, $color-sheet-background);
        max-height: 70vh;
        overflow-y: auto;
    }

    .grant-name,
    .grant-name[type="text"] {
        font-family: $font-primary;
        font-size: var(--a5e-text-size-xxl);
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .grant-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }
</style>
