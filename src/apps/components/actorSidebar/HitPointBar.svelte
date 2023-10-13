<script>
    export let hp;

    function convertToPercentage(value) {
        return `${value}%`;
    }

    function calculatePrimaryHPColor(hp) {
        const hpPercentage = Math.min((hp.value / hp.max) * 100, 100);
        return `hsl(${Math.round(hpPercentage)}, 50%, 35%)`;
    }

    function calculatePrimaryHPPercentage(hp, totalHPPercentage) {
        const tempHP = hp.temp || 0;

        const hpPercentage = Math.min(
            (hp.value / (hp.max + tempHP)) * 100,
            100
        );

        return (hpPercentage / calculateTotalHPPercentage(hp)) * 100;
    }

    function calculateTotalHPPercentage(hp) {
        const tempHP = hp.temp || 0;

        return Math.min(
            ((hp.value + (hp.temp || 0)) / (hp.max + tempHP)) * 100,
            100
        );
    }

    $: primaryHPColor = calculatePrimaryHPColor(hp);

    $: primaryHPPercentage = convertToPercentage(
        calculatePrimaryHPPercentage(hp)
    );

    $: totalHPPercentage = convertToPercentage(calculateTotalHPPercentage(hp));
</script>

<div
    class="a5e-hp-track"
    style="
        --color-primary-hp-bar: {primaryHPColor};
        --primary-hp-percentage: {primaryHPPercentage};
        --total-hp-percentage: {totalHPPercentage};
    "
/>
