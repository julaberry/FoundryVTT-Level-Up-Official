<script>
    import { getContext } from "svelte";

    import ActorInventoryShields from "../ActorInventoryShields.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import TabFooter from "../TabFooter.svelte";

    const actor = getContext("actor");
</script>

<TabFooter>
    {#if $actor.flags?.a5e?.trackInventoryWeight ?? true}
        <ItemWeightTrack />
    {/if}

    <ActorInventoryShields />
</TabFooter>
