<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let icon;
    export let tooltipText;
    export let trackProperty;
    export let options;
    export let selectedOption;

    function handleStatusEffectChange(value) {
        updateDocumentDataFromField($actor, `system.attributes.${trackProperty}`, value);
    }

    const actor = getContext("actor");

    let replaceFatigueAndStrife = game.settings.get("a5e", "replaceFatigueAndStrife");
</script>

<div
    class="track track--{trackProperty}"
    class:track--5e={replaceFatigueAndStrife}
    data-tooltip={tooltipText}
    data-tooltip-direction="DOWN"
>
    <i class="track-icon fas {icon} track-icon-level-{selectedOption}" />

    <ul class="track-items">
        {#each options as { value, hint }}
            <li data-tooltip={hint || null} data-tooltip-direction="DOWN">
                <button
                    class="track-item"
                    class:track-item-selected={value === selectedOption}
                    class:disable-pointer-events={!$actor.isOwner}
                    data-degree={value}
                    on:click={() => handleStatusEffectChange(value)}
                >
                    {value}
                </button>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    :global(.tooltip-list) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: var(--a5e-text-size-sm);
        text-align: left;
    }

    $colors: (
        "1": #919f00,
        "2": #a09200,
        "3": #af8300,
        "4": #bd7100,
        "5": #cb5c00,
        "6": #d63f00,
        "7": #e00006,
    );

    .disable-pointer-events {
        pointer-events: none;
    }

    .track {
        position: absolute;
        z-index: 2;
        display: flex;
        overflow: hidden;
        width: 2rem;
        height: 2rem;
        align-items: center;
        border-radius: 50%;

        transition: width 0.3s ease;

        &-icon {
            z-index: 1;
            display: flex;
            width: 2rem;
            height: 2rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            background: $color-light-background;
            border-radius: 50%;
            box-shadow: 0 0 10px #ccc inset;
            color: rgba(0, 0, 0, 0.2);
            cursor: pointer;
            font-size: var(--a5e-text-size-lg);
            transform: translateX(-1px);

            transition: var(--a5e-transition-standard);

            @each $level, $color in $colors {
                &-level-#{$level} {
                    border-color: $color;
                    box-shadow: 0 0 10px $color inset;
                    color: $color;
                }
            }
        }

        &-item {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 0.5rem;
            background: transparent;
            border-radius: 0;

            transition: var(--a5e-transition-standard);

            &:focus,
            &:hover {
                background: darken(#dddace, 2.5%);
                box-shadow: none;
            }

            &-selected {
                background: darken(#dddace, 2.5%);
            }
        }

        &-items {
            z-index: 0;
            display: flex;
            height: 2rem;
            padding: 0 0.75rem 0 1.5rem;
            border: 1px solid #ccc;
            border-left: 0;
            margin: 0;
            background: $color-light-background;
            border-radius: 0 1rem 1rem 0;
            list-style: none;
            opacity: 0;
            transform: translateX(-1rem);

            transition: var(--a5e-transition-standard);
        }

        &--fatigue {
            z-index: 3;
            top: 1rem;
            right: 0.625rem;
        }

        &--strife {
            top: 39%;
            right: -0.125rem;
        }

        &--5e {
            top: 2rem;
        }

        &:hover {
            overflow: initial;

            .track-items {
                opacity: 1;
            }

            .track-icon {
                color: lighten-color(var(--a5e-color-text-dark), 35);

                @each $level, $color in $colors {
                    &-level-#{$level} {
                        border-color: $color;
                        box-shadow: 0 0 10px $color inset;
                        color: $color;
                    }
                }
            }
        }
    }
</style>
