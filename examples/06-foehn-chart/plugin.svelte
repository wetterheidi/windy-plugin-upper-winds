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

    <p>
    <form name="SectionSelection">
     <label>In the Foehn charts, the pressure difference between 
        <select name="SectionSelection" id="section-names">
            <option value="GZ">Genf - Zürich</option>
            <option value="LZ">Lugano - Zürich</option>
            <option value="ZS">Zürich - Stuttgart</option>
            <option value="BI">Bozen - Innsbruck</option>
            <option selected value="IM">Innsbruck - München</option>
            <option value="KS">Klagenfurt - Salzburg</option>
            <option value="GL">Graz - Linz</option>
        </select>
     is represented.
     </label>
    </form>
        
    <h2 class="mb-10">Foehn Chart ICON</h2>
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

    type Location = 'Innsbruck' | 'München' | 'Zürich'| 'Lugano'| 'Genf'| 'Stuttgart'| 'Bozen'| 'Salzburg'| 'Klagenfurt'| 'Linz'| 'Graz';

    const locations: Record<Location, LatLon> = {
        Innsbruck: { lat: 47.260765, lon: 11.346860 },
        München: { lat: 48.163363, lon: 11.543390 },
        Zürich: { lat: 47.457340, lon: 8.554624 },
        Lugano: { lat: 46.003140, lon: 8.909517 },
        Genf: { lat: 46.241142, lon: 6.116257 },
        Stuttgart: { lat: 48.686346, lon: 9.203620 },
        Bozen: { lat: 46.460921, lon: 11.326727 },
        Salzburg: { lat: 47.792859, lon: 13.003159 },
        Klagenfurt: { lat: 46.646212, lon: 14.322369 },
        Linz: { lat: 48.235696, lon: 14.190716 },
        Graz: { lat: 46.992977, lon: 15.441671 },
        };

    type CrossSection = 'Genf - Zürich' | 'Lugano - Zürich'|'Zürich - Stuttgart' |'Bozen - Innsbruck' |'Innsbruck - München' |'Klagenfurt - Salzburg' |'Graz - Linz'; 

    const sections: Record<CrossSection, string> = {
        GZ: 'Genf - Zürich',
        LZ: 'Lugano - Zürich',
        ZS: 'Zürich - Stuttgart',
        BI: 'Bozen - Innsbruck',
        IM: 'Innsbruck - München',
        KS: 'Klagenfurt - Salzburg',
        GL: 'Graz - Linz',
        };

   /*if (i=0) {
        pointTop = locations.Genf;
        pointBottom = locations.Zürich;
        } */
        

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
