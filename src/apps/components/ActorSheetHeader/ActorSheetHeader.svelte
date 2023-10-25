<script>
    import { getContext } from "svelte";

    import AbilityScores from "./AbilityScores.svelte";
    import CharacterShields from "./CharacterShields.svelte";
    import NpcShields from "./NpcShields.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    async function onEditImage() {
        await editDocumentImage($actor);
    }

    const actor = getContext("actor");
</script>

<header class="sheet-header">
    <div class="sheet-header__banner">
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
        <img
            class="a5e-actor-image"
            src={$actor.img}
            alt={$actor.name}
            title={$actor.name}
            on:click={onEditImage}
        />

        <input
            type="text"
            name="name"
            value={$actor.name}
            class="a5e-actor-name"
            class:disable-pointer-events={!$actor.isOwner}
            placeholder="Name"
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />
    </div>

    <div class="sheet-header__summary">Summary information goes here</div>

    <!-- <section class="sheet-header-top">
        <section class="sheet-header-top-left">
            <input
                type="text"
                name="name"
                value={$actor.name}
                class="a5e-input a5e-input--character-name"
                class:disable-pointer-events={!$actor.isOwner}
                placeholder="Name"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </section>

        {#if $actor.type === "character"}
            <section>
                <CharacterShields />
            </section>
        {:else}
            <section>
                <NpcShields />
            </section>
        {/if}
    </section> -->

    <!-- <AbilityScores /> -->
</header>

<style lang="scss">
    .a5e-actor-name[type="text"] {
        display: flex;
        align-items: center;
        height: 2.25rem;
        padding-left: 0.75rem;
        font-size: var(--font-size-lg);
        font-family: var(--font-serif);
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .sheet-header {
        display: grid;
        grid-template-areas:
            "banner banner"
            "x summary"
            "x attributes";
        grid-template-columns: 7.5rem 1fr;
        grid-template-rows: repeat(3, max-content);
        grid-area: header;
        gap: 0.75rem;
        width: 100%;
        margin-bottom: 0.75rem;

        &__banner {
            display: flex;
            grid-area: banner;
            height: 2.25rem;
            margin-top: 1rem;
            color: var(--color-light-text);
            background: var(--color-primary);
            box-shadow: 0 0 10px #2e4246 inset, 0 3px 5px rgba(0, 0, 0, 0.4);
        }

        &__summary {
            grid-area: summary;
            font-family: var(--font-serif);
        }
    }

    .sheet-header-top {
        display: flex;
        width: 100%;
        gap: 0.5rem;
    }

    .sheet-header-top-left {
        display: flex;
        flex-grow: 1;
        align-items: center;
        margin-left: 0.125rem;
    }
</style>
