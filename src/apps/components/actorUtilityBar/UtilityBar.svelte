<script>
    export let modifierClasses;
</script>

<section class="a5e-utility-bar {modifierClasses}">
    <slot />
</section>

<style lang="scss">
    :global {
        .tjs-menu {
            --tjs-menu-background: url("/ui/denim075.png") repeat,
                rgba(0 0 0 / 0.15);
            --tjs-menu-primary-color: #deddd3;
            --tjs-menu-border: 1px solid #555;
        }

        .tjs-icon-button,
        .tjs-toggle-icon-button {
            a:hover {
                color: #555;
                transform: scale(1.2);
            }

            a.selected {
                color: #555;
                transform: scale(1.2);

                :hover {
                    transform: none;
                }
            }
        }
    }
</style>
