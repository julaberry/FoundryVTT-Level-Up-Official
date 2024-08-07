<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext, onDestroy } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import usesRequired from "../../../utils/usesRequired";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const actor = getContext("actor");
    const { maneuvers } = actor;
    const subTypes = CONFIG.A5E.maneuverDegrees;
    const reducerType = "maneuvers";
    const openCompendium = game.a5e.utils.openCompendium;

    let showDescription = false;
    let showUses = usesRequired(maneuvers);

    $: exertion = $actor.system.attributes.exertion;
    $: menuList = Object.entries(subTypes);

    const unsubscribe = maneuvers.subscribe((_) => {
        showUses = usesRequired(maneuvers);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if $actor.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <ShowDescription
            on:updateSelection={() => (showDescription = !showDescription)}
        />
        <Sort {reducerType} />
        <Filter {reducerType} />
        <CreateMenu {reducerType} {menuList} />

        <button
            class="a5e-import-from-compendium-button fa-solid fa-download"
            on:click={() => openCompendium($actor, "maneuvers")}
            data-tooltip="Import Maneuvers from Compendium"
            data-tooltip-direction="UP"
        ></button>
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#each Object.entries($maneuvers._degrees) as [label, items]}
        {#if items.length}
            <ItemCategory
                {label}
                {items}
                {showDescription}
                {showUses}
                type="maneuverDegrees"
            />
        {/if}
    {/each}
</section>

<TabFooter --padding-right="1rem">
    {#if $actor.type === "character"}
        <div class="u-flex u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-sm u-text-bold">
                {localize("A5E.ExertionPool")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.exertion.current"
                value={exertion.current}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
            /
            <input
                class="a5e-footer-group__input"
                type="number"
                name="system.attributes.exertion.max"
                value={exertion.max}
                disabled={$actor.automationAvailable}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />

            {#if exertion.current < exertion.max && exertion.max}
                <button
                    class="recharge-button"
                    data-tooltip="A5E.ExertionRechargeFromHitDice"
                    data-tooltip-direction="UP"
                    on:click={() => $actor.recoverExertionUsingHitDice()}
                >
                    <i class="fa-solid fa-bolt" />
                </button>
            {/if}
        </div>
    {/if}
</TabFooter>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .recharge-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0;
        margin: 0;
        margin-left: 0.25rem;
        background: none;
        color: #999;
        border: 0;

        transition: var(--a5e-transition-standard);

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }
</style>
