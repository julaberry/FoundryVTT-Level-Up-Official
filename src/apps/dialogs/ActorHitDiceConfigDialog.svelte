<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import prepareHitDice from "../dataPreparationHelpers/prepareHitDice";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const hitDice = prepareHitDice($actor);
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--dialog">
    <section
        class="a5e-hit-dice-wrapper"
        class:a5e-hit-dice-wrapper--npc={$actor.type === "npc"}
    >
        {#each hitDice as { dieSize, icon, current, total }}
            <div class="a5e-section">
                <header class="a5e-section-header">
                    <h3
                        class="a5e-section-header__heading a5e-section-header__heading--hit-dice"
                    >
                        <i class={icon} />
                        {dieSize}
                    </h3>
                </header>

                <div class="a5e-hit-die__input-container">
                    <input
                        class="a5e-hit-die-input"
                        type="number"
                        data-dtype="Number"
                        min="0"
                        name="system.attributes.hitDice.{dieSize}.current"
                        value={current}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value)
                            )}
                    />
                    /
                    <input
                        class="a5e-hit-die-input"
                        data-dtype="Number"
                        type="number"
                        min="0"
                        name="system.attributes.hitDice.{dieSize}.total"
                        value={total}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value)
                            )}
                    />
                </div>
            </div>
        {/each}
    </section>
</article>

<style lang="scss">
    .a5e-hit-dice-wrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;

        &--npc {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .a5e-hit-die-input {
        border: 0;
        border-radius: 0;
        background: transparent;
        text-align: center;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }
</style>
