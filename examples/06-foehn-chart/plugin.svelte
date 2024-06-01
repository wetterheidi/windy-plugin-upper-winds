<div class="plugin__mobile-header">
    {title}
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {title}
    </div>

    <h2 class="mb-10">Foehn Chart ICON</h2>
    <p>In the Foehn chart, the pressure difference between Innsbruck and München is represented using ICON.</p>
    <Chart
        pointTop={locations.Innsbruck} 
        pointBottom={locations.München}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <p>In the Foehn chart, the pressure difference between Innsbruck and München is represented using ICON-D2.</p>
    <Chart
        pointTop={locations.Innsbruck} 
        pointBottom={locations.München}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <p>In the Foehn chart, the pressure difference between Innsbruck and München is represented using ECMWF.</p>
    <Chart
        pointTop={locations.Innsbruck} 
        pointBottom={locations.München}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />

</section>

<script lang="ts">
    import bcast from '@windy/broadcast';

    import config from './pluginConfig';

    import Chart from './Chart.svelte';

    import type { LatLon } from '@windy/interfaces.d';

    const { title, name } = config;

    type Location = 'Innsbruck' | 'München';

    const locations: Record<Location, LatLon> = {
        Innsbruck: { lat: 47.260765, lon: 11.346860 },
        München: { lat: 48.163363, lon: 11.543390 },
        };

    type Modell = 'ICON' | 'ICOND2' | 'ECMWF';

    const nwm: Record<Modell, string> = {
        ECMWF: 'ecmwf',
        ICON: 'icon',
        ICOND2: 'iconD2',
        };
</script>

<style lang="less">
    p {
        line-height: 1.8;
    }
</style>
