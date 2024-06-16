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
        <select bind:value={showCrossSection} id="CS">
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

    /* Show wind overlay at 700 hPa*/
    windyStore.set("overlay", "wind");
    windyStore.set("level", "700h");
    
    type Location = 'Innsbruck' | 'München' | 'Zürich'| 'Lugano'| 'Genf'| 'Stuttgart'| 'Bozen'| 'Salzburg'| 'Klagenfurt'| 'Linz'| 'Graz' | 'Brescia' | 'middleOfGenfZürich' | 'middleOfLuganoZürich' | 'middleOfZürichStuttgart' | 'middleOfBozenInnsbruck' | 'middleOfInnsbruckMünchen' | 'middleOfKlagenfurtSalzburg' | 'middleOfGrazLinz' | 'middleOfBresciaBozen';

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
        middleOfGenfZürich: { lat: 46.773611, lon: 7.175278 },
        middleOfLuganoZürich: { lat: 46.674444, lon: 8.747222 },
        middleOfZürichStuttgart: { lat: 48.104444, lon: 8.893611 },
        middleOfBozenInnsbruck: { lat: 46.885833, lon: 11.336667 },
        middleOfInnsbruckMünchen: { lat: 47.751944, lon: 11.453889 },
        middleOfKlagenfurtSalzburg: { lat: 47.245833, lon: 13.624722 },
        middleOfGrazLinz: { lat: 47.665278, lon: 14.771111 },
        middleOfBresciaBozen: { lat: 45.937222, lon: 10.782778 },
        };
 
    type Modell = 'ICON' | 'ICOND2' | 'ECMWF';

    const nwm: Record<Modell, string> = {
        ECMWF: 'ecmwf',
        ICON: 'icon',
        ICOND2: 'iconD2',
        };

    export { showCrossSectionAr };
    export { showCrossSection };

    /* Center map (and place picker with wind direction and speed to) at a location refering to the cross section */
    $: {
        if (showCrossSection == 'Genf - Zürich'){

        drawLine(locations.Genf.lat, locations.Genf.lon, locations.Zürich.lat, locations.Zürich.lon);
        popupInfo(locations.middleOfGenfZürich.lat, locations.middleOfGenfZürich.lon);
        windyMap.setView([locations.middleOfGenfZürich.lat, locations.middleOfGenfZürich.lon], 8);

    } else if (showCrossSection == 'Lugano - Zürich') {
        
        drawLine(locations.Lugano.lat, locations.Lugano.lon, locations.Zürich.lat, locations.Zürich.lon);
        popupInfo(locations.middleOfLuganoZürich.lat, locations.middleOfLuganoZürich.lon);
        windyMap.setView([locations.middleOfLuganoZürich.lat, locations.middleOfLuganoZürich.lon], 8);

    } else if (showCrossSection == 'Zürich - Stuttgart') {
        
        drawLine(locations.Zürich.lat, locations.Zürich.lon, locations.Stuttgart.lat, locations.Stuttgart.lon);
        popupInfo(locations.middleOfZürichStuttgart.lat, locations.middleOfZürichStuttgart.lon);
        windyMap.setView([locations.middleOfZürichStuttgart.lat, locations.middleOfZürichStuttgart.lon], 8);

    } else if (showCrossSection == 'Bozen - Innsbruck') {
       
        drawLine(locations.Bozen.lat, locations.Bozen.lon, locations.Innsbruck.lat, locations.Innsbruck.lon);
        popupInfo(locations.middleOfBozenInnsbruck.lat, locations.middleOfBozenInnsbruck.lon);
        windyMap.setView([locations.middleOfBozenInnsbruck.lat, locations.middleOfBozenInnsbruck.lon], 8);

    } else if (showCrossSection == 'Innsbruck - München') {
        
        drawLine(locations.Innsbruck.lat, locations.Innsbruck.lon, locations.München.lat, locations.München.lon);
        popupInfo(locations.middleOfInnsbruckMünchen.lat, locations.middleOfInnsbruckMünchen.lon);
        windyMap.setView([locations.middleOfInnsbruckMünchen.lat, locations.middleOfInnsbruckMünchen.lon], 8);

    } else if (showCrossSection == 'Klagenfurt - Salzburg') {
        
        drawLine(locations.Klagenfurt.lat, locations.Klagenfurt.lon, locations.Salzburg.lat, locations.Salzburg.lon);
        popupInfo(locations.middleOfKlagenfurtSalzburg.lat, locations.middleOfKlagenfurtSalzburg.lon);
        windyMap.setView([locations.middleOfKlagenfurtSalzburg.lat, locations.middleOfKlagenfurtSalzburg.lon], 8);

    } else if (showCrossSection == 'Graz - Linz') {
        
        drawLine(locations.Graz.lat, locations.Graz.lon, locations.Linz.lat, locations.Linz.lon);
        popupInfo(locations.middleOfGrazLinz.lat, locations.middleOfGrazLinz.lon);
        windyMap.setView([locations.middleOfGrazLinz.lat, locations.middleOfGrazLinz.lon], 8);

    } else if (showCrossSection == 'Brescia - Bozen') {
        
        drawLine(locations.Brescia.lat, locations.Brescia.lon, locations.Bozen.lat, locations.Bozen.lon);
        popupInfo(locations.middleOfBresciaBozen.lat, locations.middleOfBresciaBozen.lon);
        windyMap.setView([locations.middleOfBresciaBozen.lat, locations.middleOfBresciaBozen.lon], 8);

    } else if (showCrossSection == '') {
        alert("No cross section is selected!")
    }  
    }
        
    function windValues (latitude: number,longitude: number){
      //alert("Drin " + latitude + ' ' + longitude);
      /* Place picker to location*/
    }

    /* Add layer for lines to the map*/
    var activeLine = L.featureGroup().addTo(windyMap);

    function drawLine (startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number){
        /*Delete existing line*/
        activeLine.clearLayers();
        /* Draw line between start and end location */
        var line = L.polyline([
            [startLatitude, startLongitude],
            [endLatitude, endLongitude]
            ], {color: 'red'}).addTo(activeLine);
    }

    function popupInfo (middleLatitude: number, middleLongitude: number) {
        /*Place Popup Marker in the middle of the cross section*/
        L.popup()
            .setLatLng([ middleLatitude, middleLongitude ])
            .setContent(showCrossSection)
            .openOn( windyMap );
    }
   
   
</script>

<style lang="less">
    p {
        line-height: 1.8;
    }
</style>
