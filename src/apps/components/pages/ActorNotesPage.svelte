<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Editor from "../Editor.svelte";
    import SecondaryNavigationBar from "../navigation/SecondaryNavigationBar.svelte";

    let isGM = game.user.isGM;
    const actor = getContext("actor");

    const charChoicesLabel = {
        classes: "A5E.ClassPlural",
        archetype: "A5E.Archetype",
        // background: "A5E.Background",
        // culture: "A5E.Culture",
        // destiny: "A5E.Destiny",
        // heritage: "A5E.Heritage",
        prestige: "A5E.Prestige",
    };

    const traitsLabel = {
        age: "A5E.DetailsAge",
        eyeColor: "A5E.DetailsEyeColor",
        hairColor: "A5E.DetailsHairColor",
        skinColor: "A5E.DetailsSkinColor",
        height: "A5E.DetailsHeight",
        weight: "A5E.DetailsWeight",
        gender: "A5E.DetailsGender",
    };

    const tabs = {
        appearance: {
            label: "Character Details",
            display: $actor.type === "character",
        },
        bio: {
            label: $actor.type === "npc" ? "A5E.TabBiography" : "Backstory",
            display:
                $actor.type === "character" || (isGM && $actor.type === "npc"),
        },
        notes: {
            label: "A5E.TabNotes",
        },
        privateNotes: {
            label: "A5E.DetailsNotesPrivate",
            display: isGM && $actor.type === "npc",
        },
    };

    let currentTab = $actor.type === "npc" ? "bio" : "appearance";
</script>

<SecondaryNavigationBar
    {currentTab}
    {tabs}
    on:tab-change={({ detail }) => (currentTab = detail)}
/>

<div class="notes-page">
    <section class="notes__container">
        {#if currentTab === "appearance"}
            <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
                {#each Object.entries(charChoicesLabel) as [key, label]}
                    <div
                        class="u-flex u-flex-col a5e-input-container u-gap-xs"
                        data-type={key}
                    >
                        <label
                            class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0"
                            class:disable-pointer-events={!$actor.isOwner}
                            for="{actor.id}-details-{key}"
                        >
                            {localize(label)}
                        </label>

                        <input
                            class="a5e-input a5e-input--slim u-w-full"
                            class:disable-pointer-events={!$actor.isOwner}
                            id="{actor.id}-details-{key}"
                            type="text"
                            name="system.details.{key}"
                            value={$actor.system.details[key] ?? ""}
                            on:change={({ target }) => {
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    key === "prestige"
                                        ? Number(target.value)
                                        : target.value
                                );
                            }}
                        />
                    </div>
                {/each}
            </section>

            <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
                {#each Object.entries(traitsLabel) as [key, label]}
                    <div
                        class="u-flex u-flex-col a5e-input-container u-gap-xs"
                        data-type={key}
                    >
                        <label
                            class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0"
                            class:disable-pointer-events={!$actor.isOwner}
                            for="{actor.id}-details-{key}"
                        >
                            {localize(label)}
                        </label>

                        <input
                            class="a5e-input a5e-input--slim"
                            class:disable-pointer-events={!$actor.isOwner}
                            id="{actor.id}-details-{key}"
                            type="text"
                            name="system.details.{key}"
                            value={$actor.system.details[key]}
                            on:change={({ target }) => {
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    target.value
                                );
                            }}
                        />
                    </div>
                {/each}
            </section>

            <h3 class="appearance-heading">Appearance</h3>
        {/if}

        <Editor
            document={actor}
            content={$actor.system.details[currentTab]}
            updatePath="system.details.{currentTab}"
        />
    </section>
</div>

<style lang="scss">
    .appearance-heading {
        font-size: 0.833rem;
        font-weight: bold;
        margin-left: 0.25rem;
    }

    .notes-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .notes {
        &__container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            gap: 0.5rem;
            overflow-y: auto;
        }

        &__tabs {
            display: flex;
            align-content: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #ccc;
        }
    }

    button {
        background: transparent;
        border: 1px solid #ccc;
        width: fit-content;
        padding-inline: 0.75rem;

        &:focus,
        &:hover {
            box-shadow: none;
        }
    }

    .active {
        background: $color-primary;
        border: 1px solid $color-primary;
        color: white;
    }
</style>
