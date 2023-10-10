<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import Skill from "../Skill.svelte";

    const actor = getContext("actor");
    const { A5E } = CONFIG;
    const { skillSpecialties } = A5E;

    $: skills = $actor.system.skills;

    $: showSpecialties = Object.values(skills).some(
        (skill) => skill.specialties.length
    );
</script>

<div class="a5e-item-page-wrapper">
    {#if showSpecialties}
        <section class="a5e-section">
            <header class="a5e-section-header">
                <h3 class="a5e-section-header__heading">Skill Specialties</h3>
            </header>

            <dl class="skill-specialties-list">
                {#each Object.entries(skills) as [key, skill]}
                    {#if skill.specialties.length}
                        <dt class="skill-specialties-list__skill">
                            {localize(A5E.skills[key])}
                        </dt>
                        <dd class="skill-specialties-list__specialties">
                            {skill.specialties
                                .sort((a, b) =>
                                    a
                                        .toLowerCase()
                                        .localeCompare(b.toLowerCase())
                                )
                                .map((specialty) => {
                                    if (!skillSpecialties[key])
                                        return specialty;

                                    return (
                                        skillSpecialties[key][specialty] ??
                                        specialty
                                    );
                                })
                                .join(", ")}
                        </dd>
                    {/if}
                {/each}
            </dl>
        </section>
    {/if}

    <section class="a5e-section">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Skills</h3>
        </header>
        <ul class="skills-container">
            {#each Object.entries(skills) as [key, skill], i}
                <Skill {key} {skill} />
            {/each}
        </ul>
    </section>
</div>

<style lang="scss">
    .skills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 1.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;
    }

    .skill-specialties-list {
        display: grid;
        align-items: center;
        grid-template-columns: min-content 1fr;
        gap: 0.125rem 0.75rem;
        width: 100%;
        margin: 0;
        padding: 0.25rem 0.5rem;
        font-family: var(--font-serif);
        font-size: var(--font-size-sm);
        background: rgba(255, 255, 255, 0.1);

        &__specialties {
            margin: 0;
            padding: 0;
            font-weight: 300;
        }

        &__skill {
            white-space: nowrap;
        }
    }
</style>
