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
    
     <label>In the Foehn charts, the pressure difference between 
        <select bind:value={showCrossSection}>
            {#each showCrossSectionAr as selectedCrossSection}
                <option value={selectedCrossSection}>{selectedCrossSection}</option>
            {/each}
        </select>
     is represented. 

     <p>Check winds at 700 hPa (FL100/3000 m)!</p>

    {#if showCrossSection == 'Genf - Zürich'}
	<h2 class="mb-10">Foehn Chart ICON</h2>
    <Chart
        pointTop={locations.Genf} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="Westerly winds ⮕"
        bottomText="Bise ⬅"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Genf} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="Westerly winds ⮕"
        bottomText="Bise ⬅"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <Chart
        pointTop={locations.Genf} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="Westerly winds ⮕"
        bottomText="Bise ⬅"
    />
    {:else if showCrossSection == 'Lugano - Zürich'}
    <h2 class="mb-10">Foehn Chart ICON</h2>
    <Chart
        pointTop={locations.Lugano} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Lugano} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <Chart
        pointTop={locations.Lugano} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    {:else if showCrossSection == 'Zürich - Stuttgart'}
    <h2 class="mb-10">Foehn Chart ICON</h2>
    <Chart
        pointTop={locations.Zürich} 
        pointBottom={locations.Stuttgart}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Zürich} 
        pointBottom={locations.Stuttgart}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <Chart
        pointTop={locations.Zürich} 
        pointBottom={locations.Stuttgart}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    {:else if showCrossSection == 'Bozen - Innsbruck'}
    <h2 class="mb-10">Foehn Chart ICON</h2>
    <Chart
        pointTop={locations.Bozen} 
        pointBottom={locations.Innsbruck}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Bozen} 
        pointBottom={locations.Innsbruck}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <Chart
        pointTop={locations.Bozen} 
        pointBottom={locations.Innsbruck}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    {:else if showCrossSection == 'Innsbruck - München'}
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
    {:else if showCrossSection == 'Klagenfurt - Salzburg'}
    <h2 class="mb-10">Foehn Chart ICON</h2>
    <Chart
        pointTop={locations.Klagenfurt} 
        pointBottom={locations.Salzburg}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Klagenfurt} 
        pointBottom={locations.Salzburg}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <Chart
        pointTop={locations.Klagenfurt} 
        pointBottom={locations.Salzburg}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    {:else if showCrossSection == 'Graz - Linz'}
    <h2 class="mb-10">Foehn Chart ICON</h2>
    <Chart
        pointTop={locations.Graz} 
        pointBottom={locations.Linz}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Graz} 
        pointBottom={locations.Linz}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    <hr />

    <h2 class="mb-10">Foehn Chart ECMWF</h2>
    <Chart
        pointTop={locations.Graz} 
        pointBottom={locations.Linz}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="South foehn ⬆"
        bottomText="North foehn ⬇"
    />
    {/if}
     
   

</section>



<script lang="ts">

    import bcast from '@windy/broadcast';

    import config from './pluginConfig';

    import Chart from './Chart.svelte';

    import type { LatLon } from '@windy/interfaces.d';

    import store from '@windy/store';

    import { map as windyMap } from "@windy/map";

    import windyStore from "@windy/store";

    let showCrossSection = '';

    const { title, name } = config;

    /* Set Map to Zoomlevel 8 and center at Innsbruck*/
    windyMap.setView([47.260765, 11.346860], 8);
    /* Show wind overlay */
    windyStore.set("overlay", "wind");
    /* Wind auf 700 hPa einstellen */

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
 
    const showCrossSectionAr = [
        'Genf - Zürich',
        'Lugano - Zürich',
        'Zürich - Stuttgart',
        'Bozen - Innsbruck',
        'Innsbruck - München',
        'Klagenfurt - Salzburg',
        'Graz - Linz',
        ];

        
//Was passiert hier?
store.insert('windy-plugin-foehn-cross-section', {
    def: showCrossSectionAr[4],
    allowed: showCrossSectionAr,
    save: true
});

showCrossSection = store.get('windy-plugin-foehn-cross-section');
export { showCrossSection };

    type Modell = 'ICON' | 'ICOND2' | 'ECMWF';

    const nwm: Record<Modell, string> = {
        ECMWF: 'ecmwf',
        ICON: 'icon',
        ICOND2: 'iconD2',
        };

    export { showCrossSectionAr };

</script>

<style lang="less">
    p {
        line-height: 1.8;
    }
</style>
