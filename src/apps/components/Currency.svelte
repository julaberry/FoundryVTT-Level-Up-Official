<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: currency = $actor.system.currency;
</script>

<ul class="a5e-currencies-wrapper">
    {#each Object.entries(currency) as [label, value]}
        <li class="a5e-currency" data-type={label}>
            <label
                class="a5e-currency__label"
                class:disable-pointer-events={!$actor.isOwner}
                for="currency-{label}"
            >
                {localize(label)}
            </label>

            <input
                class="a5e-currency__input"
                class:disable-pointer-events={!$actor.isOwner}
                id="currency-{label}"
                type="number"
                name="system.currency.{label}"
                {value}
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
            />
        </li>
    {/each}
</ul>
