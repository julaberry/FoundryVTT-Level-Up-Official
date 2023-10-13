<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Skill from "../Skill.svelte";

    function getSkillSpecialties(skillKey, skill) {
        return skill.specialties
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((specialty) => {
                if (!skillSpecialties[skillKey]) return specialty;

                return skillSpecialties[skillKey][specialty] ?? specialty;
            })
            .join(", ");
    }

    const actor = getContext("actor");
    const { A5E } = CONFIG;
    const { skillSpecialties } = A5E;

    $: skills = $actor.system.skills;

    $: showSpecialties = Object.values(skills).some(
        (skill) => skill.specialties.length
    );
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--skills">
    {#if showSpecialties}
        <section class="a5e-section a5e-section--skill-specialties">
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
                            {getSkillSpecialties(key, skill)}
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
        font-size: var(--font-size-sm);
        background: rgba(246, 242, 235, 0.15);
    }

    .skill-specialties-list {
        display: grid;
        align-items: center;
        grid-template-columns: min-content 1fr;
        gap: 0.125rem 0.75rem;
        width: 100%;
        margin: 0;
        padding: 0.25rem 0.5rem;
        font-size: var(--font-size-sm);

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
