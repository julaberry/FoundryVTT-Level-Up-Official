<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    export let level = 0;

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if level && level !== "0"}
    <div class="spell-slot-wrapper">
        <input
            class="number-input number-input--spell-slots"
            class:disable-pointer-events={!$actor.isOwner}
            type="number"
            name="system.spellResources.slots.{level}.current"
            value={spellResources.slots[level.toString()].current}
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
            class="number-input number-input--spell-slots"
            type="number"
            name="system.spellResources.slots.{level}.max"
            value={spellResources.slots[level.toString()].max}
            placeholder="0"
            min="0"
            disabled={sheetIsLocked}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .number-input {
        height: 1rem;
        width: 5ch;
        font-size: var(--font-size-xs);
        line-height: 1;
        text-align: center;
        background: transparent;
        border: 1px solid #bbb;

        &:hover {
            border: 1px solid #bbb;
        }

        &--spell-slots {
            color: var(--color-light-text);
            background: rgba(108, 103, 103, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);

            &:hover {
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        }
    }

    .spell-slot-wrapper {
        display: flex;
        gap: 0.25rem;
    }
</style>
