<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let hp;

    const actor = getContext("actor");
</script>

<div class="a5e-hp-container">
    <div class="a5e-section">
        <header class="a5e-section-header a5e-section-header--hp">
            <h3
                class="a5e-section-header__heading"
                data-tooltip="Temporary HP"
                data-tooltip-direction="UP"
            >
                <i class="fa-solid fa-heart-circle-bolt" />
            </h3>
        </header>

        <input
            class="hp-input"
            class:disable-pointer-events={!$actor.isOwner}
            type="number"
            name="system.attributes.hp.temp"
            value={hp.temp}
            placeholder="0"
            min="0"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
            on:click={({ target }) => target.select()}
        />
    </div>

    <div class="a5e-section">
        <header class="a5e-section-header a5e-section-header--hp">
            <h3
                class="a5e-section-header__heading"
                data-tooltip="Current HP"
                data-tooltip-direction="UP"
            >
                <i class="fa-solid fa-heart" />
            </h3>
        </header>

        <div class="a5e-hp-input-wrapper">
            <input
                class="hp-input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.hp.value"
                value={hp.value}
                placeholder="0"
                min="0"
                max={hp.max}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
                on:click={({ target }) => target.select()}
            />
            /
            <input
                class="hp-input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.hp.max"
                value={hp.max}
                min="0"
                placeholder="0"
                disabled
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
                on:click={({ target }) => target.select()}
            />
        </div>
    </div>

    <div class="a5e-section">
        <header class="a5e-section-header a5e-section-header--hp">
            <h3
                class="a5e-section-header__heading"
                data-tooltip="Max HP Modifier"
                data-tooltip-direction="UP"
            >
                <i class="fa-solid fa-heart-circle-plus" />
            </h3>
        </header>

        <input
            class="hp-input"
            class:disable-pointer-events={!$actor.isOwner}
            type="number"
            name="system.attributes.hp.bonus"
            value={hp.bonus}
            placeholder="0"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
            on:click={({ target }) => target.select()}
        />
    </div>
</div>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-hp-container {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 0.375rem;
        padding: 2px;
    }

    .a5e-hp-input-wrapper {
        display: flex;
        align-items: center;
    }

    .hp-input {
        height: unset;
        text-align: center;
        border: 0;
        background: transparent;
        padding-inline: 0rem;
        padding-block: 0.25rem;
        font-size: var(--font-size-sm);

        &:active,
        &:focus {
            outline: 0;
            box-shadow: none;
        }
    }
</style>
