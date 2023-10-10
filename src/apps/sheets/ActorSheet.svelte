<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { getContext, setContext } from "svelte";

    import ActorCorePage from "../components/pages/ActorCorePage.svelte";
    import ActorEffectsPage from "../components/pages/ActorEffectsPage.svelte";
    import ActorFeaturesPage from "../components/pages/ActorFeaturesPage.svelte";
    import ActorInventoryPage from "../components/pages/ActorInventoryPage.svelte";
    import ActorManeuversPage from "../components/pages/ActorManueversPage.svelte";
    import ActorNotesPage from "../components/pages/ActorNotesPage.svelte";
    import ActorSheetHeader from "../components/ActorSheetHeader/ActorSheetHeader.svelte";
    import ActorSettingsPage from "../components/pages/ActorSettingsPage.svelte";
    import ActorSidebar from "../components/actorSidebar/ActorSidebar.svelte";
    import ActorSkillsPage from "../components/pages/ActorSkillsPage.svelte";
    import ActorSpellsPage from "../components/pages/ActorSpellsPage.svelte";
    import NewNavigationBar from "../components/navigation/NewNavigationBar.svelte";

    import ActorSheetTempSettingsStore from "../../stores/ActorSheetTempSettingsStore";

    export let { document, sheet } = getContext("#external").application;
    export let elementRoot;

    function updateCurrentTab({ detail: name }) {
        const { uuid } = $actor;
        currentTab = name;

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                currentTab: name,
            },
        }));
    }

    function getTabs(actor) {
        return {
            core: {
                icon: "fa-solid fa-home",
                label: "A5E.TabCore",
                component: ActorCorePage,
            },
            skills: {
                icon: "fa-solid fa-graduation-cap",
                label: "A5E.TabSkills",
                component: ActorSkillsPage,
                display: actor.flags?.a5e?.showFavoritesSection ?? true,
            },
            inventory: {
                icon: "fa-solid fa-box-open",
                label: "A5E.TabInventory",
                component: ActorInventoryPage,
            },
            features: {
                icon: "fa-solid fa-table-list",
                label: "A5E.TabFeatures",
                component: ActorFeaturesPage,
            },
            maneuvers: {
                icon: "fa-solid fa-hand-fist",
                label: "A5E.TabManeuvers",
                component: ActorManeuversPage,
                display: actor.flags?.a5e?.showManeuverTab,
            },
            spells: {
                icon: "fa-solid fa-wand-sparkles",
                label: "A5E.TabSpells",
                component: ActorSpellsPage,
                display: actor.flags?.a5e?.showSpellTab,
            },
            notes: {
                icon: "fa-solid fa-file-lines",
                label: "A5E.TabNotes",
                component: ActorNotesPage,
            },
            // bonuses: {
            //     icon: "fa-solid fa-angles-up",
            //     label: "Bonuses",
            //     component: ActorEffectsPage,
            // },
            effects: {
                icon: "fa-solid fa-person-rays",
                label: "A5E.TabEffects",
                component: ActorEffectsPage,
            },
            // prestige: {
            //     icon: "fa-solid fa-medal",
            //     label: "Prestige",
            // },
            settings: {
                icon: "fa-solid fa-gear",
                label: "A5E.TabSettings",
                component: ActorSettingsPage,
                display:
                    !actor.pack &&
                    actor.permission !==
                        CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER,
            },
        };
    }

    let tempSettings = {};

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    const actor = document;

    // Required to get the tabs to update as the actor flags change
    let tabs = getTabs($actor);
    $: tabs = getTabs($actor);

    let currentTab = tempSettings[$actor?.uuid]?.currentTab ?? "core";

    setContext("actor", actor);
    setContext("sheet", sheet);
</script>

<ApplicationShell bind:elementRoot>
    <main
        on:drop|preventDefault|stopPropagation={(event) => sheet._onDrop(event)}
    >
        <ActorSidebar />

        <section class="main-container">
            <ActorSheetHeader />

            <!-- <NavigationBar
                {currentTab}
                {tabs}
                showLock={true}
                on:tab-change={updateCurrentTab}
            /> -->

            <NewNavigationBar
                {currentTab}
                {tabs}
                showLock={true}
                on:tab-change={updateCurrentTab}
            />

            <svelte:component this={tabs[currentTab]?.component} />
        </section>
    </main>
</ApplicationShell>

<style lang="scss">
    :global {
        .a5e-actor-sheet {
            min-width: 47.1875rem;
        }

        .a5e-sheet .window-content {
            padding: 0;
            overflow-y: hidden;
        }
    }

    main {
        display: flex;
        height: 100%;
        background: $color-sheet-background;
    }

    .main-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: 100%;
        overflow: hidden;
    }
</style>
