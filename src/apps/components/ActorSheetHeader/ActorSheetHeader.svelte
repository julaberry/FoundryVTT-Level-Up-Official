<script>
    import { getContext } from "svelte";

    import AbilityScores from "./AbilityScores.svelte";
    import CharacterShields from "./CharacterShields.svelte";
    import HitPointBar from "../actorSidebar/HitPointBar.svelte";
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

        <!-- <HitPointBar hp={$actor.system.attributes.hp} /> -->

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={$actor.name}
                class="a5e-actor-name"
                class:disable-pointer-events={!$actor.isOwner}
                placeholder="Name"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />

            <div class="sheet-header__summary">
                <span>{CONFIG.A5E.actorSizes[$actor.system.traits.size]}</span>
                ·
                <span>
                    {$actor.system.details.creatureTypes
                        .map(
                            (creatureType) =>
                                CONFIG.A5E.creatureTypes[creatureType]
                        )
                        .join(", ")}
                </span>
            </div>
        </div>
    </div>

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

    <AbilityScores />
</header>

<style lang="scss">
    .a5e-actor-name[type="text"] {
        display: flex;
        align-items: center;
        padding: 0;
        font-size: var(--font-size-lg);
        font-family: var(--font-serif);
        border: 0;
        background: transparent;
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .name-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 0.75rem;
    }

    .sheet-header {
        display: grid;
        grid-template-areas:
            "banner banner"
            "x attributes";
        grid-template-columns: 10rem 1fr;
        grid-template-rows: repeat(3, max-content);
        grid-area: header;
        gap: 0.75rem;
        width: 100%;
        margin-bottom: 0.75rem;

        &__banner {
            position: relative;
            display: flex;
            grid-area: banner;
            height: 3rem;
            margin-top: 1rem;
            color: var(--color-light-text);
            background: var(--color-primary);
            box-shadow: 0 0 10px #2e4246 inset, 0 3px 5px rgba(0, 0, 0, 0.4);
        }

        &__summary {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: var(--font-size-xs);
            font-family: var(--font-serif);
            opacity: 0.8;
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
