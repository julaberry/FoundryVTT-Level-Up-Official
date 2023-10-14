<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import prepareHitDice from "../dataPreparationHelpers/prepareHitDice";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const hpFields = [
        { label: "A5E.HitPointsCurrent", updateAttribute: "value" },
        { label: "A5E.HitPointsBaseMaximum", updateAttribute: "baseMax" },
        { label: "A5E.HitPointsTemporary", updateAttribute: "temp" },
        { label: "A5E.HitPointsMaxModifier", updateAttribute: "bonus" },
    ];

    const actor = new TJSDocument(actorDocument);

    $: hp = $actor.system.attributes.hp;
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--dialog">
    <section class="a5e-hp-wrapper">
        {#each hpFields as { label, updateAttribute }}
            <div class="a5e-section">
                <header class="a5e-section-header">
                    <h3 class="a5e-section-header__heading">
                        {localize(label)}
                    </h3>
                </header>

                <input
                    class="a5e-hp-input"
                    type="number"
                    data-dtype="Number"
                    name="system.attributes.hp.{updateAttribute}"
                    value={hp[updateAttribute]}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        {/each}
    </section>
</article>

<style lang="scss">
    .a5e-hp-input {
        border: 0;
        border-radius: 0;
        background: transparent;
        text-align: center;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .a5e-hp-wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }
</style>
