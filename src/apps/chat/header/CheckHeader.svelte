<script>
    import { createEventDispatcher } from "svelte";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const { actorId, img, name } = $message?.flags?.a5e;
    const actor = fromUuidSync(actorId);
    const dispatch = createEventDispatcher();
    const { user } = game;
</script>

{#if user.isGM || actor?.testUserPermission(user, 1)}
    <BaseHeader
        {img}
        altText={name}
        clickableHeader={false}
        title={name}
        --bottom-padding="0.25rem"
        on:repeatCard={() => dispatch("repeatCard")}
    />
{/if}
