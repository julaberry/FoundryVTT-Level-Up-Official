<script>
    import { getContext } from "svelte";

    import RadioGroup from "../components/RadioGroup.svelte";

    export let { dialog, item } = getContext("#external").application;

    function onSubmit() {
        dialog.submit({ actionId: selectedAction });
    }

    let selectedAction = item.actions.keys()[0];
</script>

<form>
    <RadioGroup
        heading="Select an Action"
        options={item.actions
            .entries()
            .map(([id, action]) => [id, action.name])}
        selected={selectedAction}
        on:updateSelection={({ detail }) => (selectedAction = detail)}
    />

    <button on:click|preventDefault={onSubmit}>Activate Action</button>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        background: $color-sheet-background;
    }
</style>
