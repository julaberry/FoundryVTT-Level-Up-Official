<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { localize } from "#runtime/svelte/helper";

    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import Settings5eTab from "./Settings5eTab.svelte";
    import SettingsActorTab from "./SettingsActorTab.svelte";
    import SettingsCanvasTab from "./SettingsCanvasTab.svelte";
    import SettingsChatCardTab from "./SettingsChatCardTab.svelte";
    import SettingsEffectsTab from "./SettingsEffectsTab.svelte";
    import SettingsMiscTab from "./SettingsMiscTab.svelte";
    import SettingsPartyViewerTab from "./SettingsPartyViewerTab.svelte";
    import SettingsRollTab from "./SettingsRollTab.svelte";

    export let elementRoot;
    export let { appId, settings, dialog } = getContext("#external").application;

    function onSubmit() {
        for (const [key, value] of updates) {
            const setting = settings.getStore(key);
            setting.set(value);
        }

        dialog.submit({
            reload,
        });
    }

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "actor",
            label: "A5E.settings.navigation.actor",
            component: SettingsActorTab,
        },
        {
            name: "canvas",
            label: "A5E.settings.navigation.canvas",
            component: SettingsCanvasTab,
            display: game.user.isGM,
        },
        {
            name: "chat",
            label: "A5E.settings.navigation.chat",
            component: SettingsChatCardTab,
        },
        {
            name: "effects",
            label: "A5E.settings.navigation.activeEffects",
            component: SettingsEffectsTab,
            display: game.user.isGM,
        },
        {
            name: "partyViewer",
            label: "Party Viewer",
            component: SettingsPartyViewerTab,
            display: $playersCanAccessPartyViewer,
        },
        {
            name: "rolls",
            label: "A5E.settings.navigation.rolls",
            component: SettingsRollTab,
            display: game.user.isGM,
        },
        {
            name: "5eSettings",
            label: "A5E.settings.navigation.5eSettings",
            component: Settings5eTab,
            display: game.user.isGM,
        },
        {
            name: "misc",
            label: "A5E.settings.navigation.misc",
            component: SettingsMiscTab,
            display: game.user.isGM,
        },
    ];

    let currentTab = tabs[0];
    let updates = new Map();
    let reload = false;

    let { settingsData } = settings;

    let gmSettings = settingsData.reduce((acc, setting) => {
        if (setting?.options?.scope === "world") acc.add(setting.key);
        return acc;
    }, new Set());

    const playersCanAccessPartyViewer = settings.getStore("playersCanAccessPartyViewer");

    setContext("appId", appId);
    setContext("gmSettings", gmSettings);
    setContext("settings", settings);
    setContext("updates", updates);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

        <section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
            <svelte:component this={currentTab.component} bind:reload />
        </section>

        <button class="submit" on:click|preventDefault={() => onSubmit()}>
            {#if reload}
                <i
                    class="fa-solid fa-circle-exclamation"
                    style="color: var(--a5e-color-warning)"
                    data-tooltip={localize("A5E.settings.reload")}
                    data-tooltip-direction="UP"
                />
            {:else}
                <i class="fas fa-save" />
            {/if}
            {localize("A5E.SaveSubmit")}
        </button>
    </main>
</ApplicationShell>

<style lang="scss">
    :global(.a5e-settings-sheet) {
        max-height: 85vh;
    }

    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 30rem;
        padding: 0.75rem;
        gap: 0.5rem;

        background: $color-sheet-background;
    }

    .submit {
        margin-top: auto;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
