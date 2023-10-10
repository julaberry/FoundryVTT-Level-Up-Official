<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import Effect from "./Effect.svelte";

    export let label;
    export let effects;

    function getEffectTemplateConfiguration(sheetIsLocked) {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if ($doc.documentName === "Item" || !sheetIsLocked) {
            areas += " menu";
            columns += " 2rem";
        }

        return { areas: `"${areas}"`, columns };
    }

    const doc = getContext("actor") ?? getContext("item");

    $: sheetIsLocked = !$doc.isOwner
        ? true
        : $doc.documentName === "Item"
        ? false
        : $doc.flags?.a5e?.sheetIsLocked ?? true;
    $: effectTemplateConfiguration =
        getEffectTemplateConfiguration(sheetIsLocked);
</script>

<section>
    <header class="a5e-section-header a5e-section-header--document-list">
        <h3
            class="a5e-section-header__heading a5e-section-header__heading--name"
        >
            {localize(label)}
        </h3>
    </header>

    <ul class="effects-container">
        {#each [...effects] as effect (effect.id)}
            <Effect
                {effect}
                --effectTemplateAreas={effectTemplateConfiguration.areas}
                --effectTemplateColumns={effectTemplateConfiguration.columns}
            />
        {/each}
    </ul>
</section>

<style lang="scss">
    .a5e-section-header__heading--name {
        text-align: left;
    }

    .effects-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        padding-right: 0.375rem;
        margin: 0;
        margin-right: -0.375rem;
        list-style: none;
        overflow-y: auto;
    }
</style>
