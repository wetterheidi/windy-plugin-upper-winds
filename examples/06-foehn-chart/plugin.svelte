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
    
     <label>In these charts, the pressure difference between   
        <select bind:value={showCrossSection}>
            {#each showCrossSectionAr as selectedCrossSection}
                <option value={selectedCrossSection}>{selectedCrossSection}</option>
            {/each}
        </select>
     is represented. 

    {#if showCrossSection == 'Genf - Zürich'}
	<h2 class="mb-10">Bise Chart ICON</h2>
    <Chart
        pointTop={locations.Genf} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="Westerly winds ⮕"
        bottomText="Bise ⬅"
    />
    <hr />

    <h2 class="mb-10">Bise Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Genf} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="Westerly winds ⮕"
        bottomText="Bise ⬅"
    />
    <hr />

    <h2 class="mb-10">Bise Chart ECMWF</h2>
    <Chart
        pointTop={locations.Genf} 
        pointBottom={locations.Zürich}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="Westerly winds ⮕"
        bottomText="Bise ⬅"
    />
    <p>Bise: Pressure difference of at least -4 hPa and northeasterly winds at 700 hPa</p>
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
    <p>Foehn: Pressure difference of at least +/-4 hPa and southerly/northerly winds of at least 20 kt at 700 hPa</p>
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
    <p>Foehn: Pressure difference of at least +/-4 hPa and southerly/northerly winds of at least 20 kt at 700 hPa</p>
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
    <p>Foehn: Pressure difference of at least +/-4 hPa and southerly/northerly winds of at least 20 kt at 700 hPa</p>
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
    <p>Foehn: Pressure difference of at least +/-4 hPa and southerly/northerly winds of at least 20 kt at 700 hPa</p>
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
    <p>Foehn: Pressure difference of at least +/-4 hPa and southerly/northerly winds of at least 20 kt at 700 hPa</p>
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
    <p>Foehn: Pressure difference of at least +/-4 hPa and southerly/northerly winds of at least 20 kt at 700 hPa</p>
    {:else if showCrossSection == 'Brescia - Bozen'}
    <h2 class="mb-10">Ora Chart ICON</h2>

    <Chart
        pointTop={locations.Brescia} 
        pointBottom={locations.Bozen}
        forecastModel={nwm.ICON}
        nameOfThisPlugin={name}
        topText="Ora ⬆"
        bottomText="Peler ⬇"
    />
    <hr />

    <h2 class="mb-10">Ora Chart ICON-D2</h2>
    <Chart
        pointTop={locations.Brescia} 
        pointBottom={locations.Bozen}
        forecastModel={nwm.ICOND2}
        nameOfThisPlugin={name}
        topText="Ora ⬆"
        bottomText="Peler ⬇"
    />
    <hr />

    <h2 class="mb-10">Ora Chart ECMWF</h2>
    <Chart
        pointTop={locations.Brescia} 
        pointBottom={locations.Bozen}
        forecastModel={nwm.ECMWF}
        nameOfThisPlugin={name}
        topText="Ora ⬆"
        bottomText="Peler ⬇"
    />
    <p>Ora/Peler: Stronger pressure differences refer to stronger winds</p>
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

    import { emitter as picker } from "@windy/picker";

    let showCrossSection ='';

    const { title, name } = config;

    const showCrossSectionAr = [
        'Genf - Zürich',
        'Lugano - Zürich',
        'Zürich - Stuttgart',
        'Bozen - Innsbruck',
        'Innsbruck - München',
        'Klagenfurt - Salzburg',
        'Graz - Linz',
        'Brescia - Bozen',
        ];

    //Was passiert hier?
    store.insert('windy-plugin-foehn-cross-section', {
       def: showCrossSectionAr[4],
       allowed: showCrossSectionAr,
       save: true
    });

    showCrossSection = store.get('windy-plugin-foehn-cross-section');

    /* Set Map to Zoomlevel 8 and center at Innsbruck*/
    //windyMap.setView([47.260765, 11.346860], 8);
    /* Show wind overlay at 700 hPa*/
    windyStore.set("overlay", "wind");
    windyStore.set("level", "700h");
    
    centerMap();
    
    type Location = 'Innsbruck' | 'München' | 'Zürich'| 'Lugano'| 'Genf'| 'Stuttgart'| 'Bozen'| 'Salzburg'| 'Klagenfurt'| 'Linz'| 'Graz' | 'Brescia';

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
        Brescia: { lat: 45.436234, lon: 10.268309 },
        };
 
    type Modell = 'ICON' | 'ICOND2' | 'ECMWF';

    const nwm: Record<Modell, string> = {
        ECMWF: 'ecmwf',
        ICON: 'icon',
        ICOND2: 'iconD2',
        };

    export { showCrossSectionAr };
    export { showCrossSection };

    function centerMap(){
    /* Center map (and place picker with wind direction and speed to) at a location refering to the cross section */
    if (showCrossSection == 'Genf - Zürich'){
        windyMap.setView([46.707778, 7.308056], 8);
    } else if (showCrossSection == 'Lugano - Zürich') {
        windyMap.setView([46.674444, 8.747222], 8);
    } else if (showCrossSection == 'Zürich - Stuttgart') {
        windyMap.setView([48.108333, 8.870278], 8);
    } else if (showCrossSection == 'Bozen - Innsbruck') {
        windyMap.setView([46.891389, 11.364167], 8);
    } else if (showCrossSection == 'Innsbruck - München') {
        windyMap.setView([47.751389, 11.473889], 8);
    } else if (showCrossSection == 'Klagenfurt - Salzburg') {
        windyMap.setView([47.245833, 13.624722], 8);
    } else if (showCrossSection == 'Graz - Linz') {
        windyMap.setView([47.695, 14.855], 8);
    } else if (showCrossSection == 'Brescia - Bozen') {
        windyMap.setView([45.861944, 10.870833], 8);
    } else if (showCrossSection == '') {
        windyMap.setView([55, 20], 8);
    }  
    }

    $: {
        //showCrossSection = 'Genf - Zürich';
        //windyMap.setView([46.707778, 7.308056], 8);
        centerMap();
        //switchCoordsDiv(showCoords);
    }

</script>

<style lang="less">
    p {
        line-height: 1.8;
    }
</style>
