<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags;
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Roll Modifiers</h3>
        </header>

        <FormSection
            hint="A5E.settings.hints.halflingLuck"
            --background="rgba(255, 255, 255, 0.1)"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.halflingLuck"
                checked={flags.a5e?.halflingLuck ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.halflingLuck",
                        detail
                    );
                }}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.jackOfAllTrades"
            --background="rgba(255, 255, 255, 0.1)"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.jackOfAllTrades"
                checked={flags.a5e?.jackOfAllTrades ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.jackOfAllTrades",
                        detail
                    );
                }}
            />
        </FormSection>
    </div>
</section>
