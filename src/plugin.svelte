<div class="plugin__mobile-header">
    {title}
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {title} <span style="font-size: 0.5em;">v{version}</span>
    </div>

    {#if !ready}
        <h4><strong>Click on map to generate an upper wind table</strong></h4>
    {:else}
        <h4>
            <strong>Location: </strong><br />
            {clickLocation}
        </h4>
        <h4>
            <strong>Forecast time: </strong><br />
            {forecastDateString}
        </h4>
        <h4>
            <strong>Forecast model: </strong><br />
            {forecastModel}
        </h4>
        <h4>
            <strong>Elevation:</strong>
            {elevation}
        </h4>
        <hr />
        <h4><strong>Upper winds, temperature and humidity</strong></h4>
        <div class="weather-stats">
            <table>
                <thead>
                    <tr>
                        <th>h</th>
                        <th>Dir</th>
                        <th>Speed</th>
                        <th>p</th>
                        <th>T</th>
                        <th>Td</th>
                        <th>RHw</th>
                    </tr>
                    <tr>
                        <th>{altitudeUnit} <br />{settings.referenceLevel}</th>
                        <th>°</th>
                        <th>{windUnit}</th>
                        <th>hPa</th>
                        <th>{temperatureUnit}</th>
                        <th>{temperatureUnit}</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {#each flightLevels as { heightAGL, height, windDir, windSp, pressure, temperature, humidityWater, dewPointt }}
                        <tr
                            class:green-text={temperature > freezingLevelAt - 0.5 &&
                                temperature < freezingLevelAt + 0.5}
                            class:blue-text={temperature <= freezingLevelAt - 0.5}
                            class:red-text={temperature >= freezingLevelAt + 0.5}
                        >
                            {#if settings.referenceLevel == 'AGL'}
                                <td>{heightAGL}</td>
                            {:else}
                                <td>{height}</td>
                            {/if}
                            <td>{windDir}</td>
                            <td>{windSp}</td>
                            <td>{pressure}</td>
                            <td>{temperature}</td>
                            <td>{dewPointt}</td>
                            <td>{humidityWater}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <hr />
        <div>
            <h4>
                <strong>Settings: </strong><br />
                <h4>
                    <div class="mb-3">
                        <label for="" class="form-label">Choose interpolation step: </label>
                        <select bind:value={settings.increment} class="from-select">
                            <option value="" disabled>-- Select Increment --</option>
                            {#each incrementquestions as incrementquestion}
                                <option value={incrementquestion.text}
                                    >{incrementquestion.text}</option
                                >
                            {/each}
                        </select>
                        <label for="" class="form-label">{altitudeUnit} </label>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label"
                            >Choose reference level for altitude:
                        </label>
                        <select bind:value={settings.referenceLevel} class="from-select">
                            <option value="" disabled>-- Select Reference --</option>
                            {#each referencelevelquestions as referencelevelquestions}
                                <option value={referencelevelquestions.text}
                                    >{referencelevelquestions.text}</option
                                >
                            {/each}
                        </select>
                    </div>
                </h4>
            </h4>
        </div>
    {/if}
    <hr />
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';
    import { singleclick } from '@windy/singleclick';
    import { UpperWind } from './classes/UpperWind.class';
    import windyStore from '@windy/store';
    import { LatLon } from '@windycom/plugin-devtools/types/interfaces';
    import { Utility } from './classes//Utility.class';

    let ready = false;
    let flightLevels: any[] = [];
    let clickLocation = '';
    let filteredFlightLevels: any[] = [];
    let forecastDate: any = '';
    let forecastDateString: string = '';
    let forecastModel = '';
    let elevation: any;
    let position: LatLon | undefined = undefined;

    const { title } = config;
    const { version } = config;
    const upperwind = new UpperWind();

    /* Take user settings for Table*/
    /* Settings for temperature*/
    let temperatureUnit: string = Utility.findOutTemperatureUnit(273.15); //Kelvin in raw data
    let freezingLevelAt: number = 0;
    if (temperatureUnit === '°C') {
        freezingLevelAt = 0;
    } else if (temperatureUnit === '°F') {
        freezingLevelAt = 32;
    }
    /* Settings for wind*/
    let windUnit: string = Utility.findOutWindUnit(10); // m/s in raw data

    let altitudeUnit: string = Utility.findOutAltitudeUnit(100); // m in raw data

    let settings = {
        increment: '500',
        referenceLevel: 'AGL',
    };

    let incrementquestions = [
        { text: '100' },
        { text: '200' },
        { text: '500' },
        { text: '1000' },
        { text: '2000' },
    ];

    let referencelevelquestions = [{ text: 'AGL' }, { text: 'AMSL' }];

    //On settings changed, recalculate upper winds table
    $: {
        upperwind._step = Number(settings.increment);
        const fl = upperwind.restratify();
        if (fl) {
            flightLevels = fl;
        }
    }
    $: {
        console.log('----> Reference level set to: ', settings.referenceLevel);
        upperwind._reference = settings.referenceLevel;
        const fl = upperwind.restratify();
        if (fl) {
            flightLevels = fl;
        }
    }

    /* Add layer for lines to the map*/
    var activeLayer = L.featureGroup().addTo(map);
    var popup = L.popup({ autoClose: false, closeOnClick: false, closeButton: false });

    activeLayer.clearLayers();

    export const onopen = async (_params: { lat: any; lon: any }) => {
        if (!_params) {
            return; // Ignore null _params and do not execute further
        }
        bcast.emit('pluginOpened', _params);
        popup
            .setLatLng([_params.lat, _params.lon])
            .setContent('Loading....')
            .addTo(activeLayer)
            .openOn(map);

        bcast.on('paramsChanged', async () => {
            upperwind.setTime(windyStore.get('timestamp'));
            await upperwind.handleEvent(_params); // Wait for handleEvent to complete
            assignAnalysis(upperwind);
        });
    };

    const listener = () => {
        console.log('---redrawFinished', new Date(windyStore.get('timestamp')));
        assignAnalysis(upperwind);
    };

    onMount(() => {
        /** Eventhandler for the click on the map*/

        singleclick.on('windy-plugin-upper-winds', async ev => {
            position = { lat: ev.lat, lon: ev.lon };
            /* Create a Popup to show the clicked position*/
            popup
                .setLatLng([position.lat, position.lon])
                .setContent('Loading....')
                .addTo(activeLayer)
                .openOn(map);
            await upperwind.handleEvent(ev); // Wait for handleEvent to complete
            assignAnalysis(upperwind);
            popup.setContent(clickLocation);
        });
        bcast.on('pluginOpened', async () => {
            if (position === undefined) return;
            upperwind.setTime(windyStore.get('timestamp'));
            await upperwind.handleEvent(position); // Wait for handleEvent to complete
            assignAnalysis(upperwind);
            popup.setContent(clickLocation);
        });
        /** Eventhandler for stepping forward or backward in time*/
        bcast.on('paramsChanged', async () => {
            if (position === undefined) return;
            upperwind.setTime(windyStore.get('timestamp'));
            await upperwind.handleEvent(position); // Wait for handleEvent to complete
            assignAnalysis(upperwind);
        });
        bcast.on('pluginClosed', async () => {
            popup.closePopup();
        });
    });

    onDestroy(() => {
        bcast.off('redrawFinished', listener);
        bcast.off('paramsChanged');
        bcast.off('pluginOpened');
        popup.closePopup();
        popup.remove();
    });

    /* Assigns the Analysis to a location and a model*/
    function assignAnalysis(upperwind: UpperWind) {
        clickLocation = upperwind.clickLocation;
        flightLevels = upperwind.flightLevels;
        filteredFlightLevels = flightLevels.filter(
            level => level.temperature <= level.applemanTemp,
        );

        forecastDate = new Date(windyStore.get('timestamp'));
        //Format the Date to ICAO Standards
        let year = forecastDate.getFullYear();
        let month = forecastDate.getMonth() + 1;
        let day = forecastDate.getDate();
        let hours = forecastDate.getHours();
        forecastDateString = year + '-' + month + '-' + day + ' ' + hours + ':00 loc ';
        forecastModel = upperwind.model;
        elevation =
            (upperwind.elevation * 3.28084).toFixed(0) + ' ft/ ' + upperwind.elevation + ' m';
        ready = true;
    }
</script>

<style lang="less">
    .weather-stats {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: #f8f8f8;
        text-align: center;
        th {
            color: black; /* Sets the text color of headers to black */
            background-color: #e5e5e5; /* Optional: sets a light gray background for better contrast */
        }
        td {
            text-align: right;
            width: 14.28%; // make all columns the same width
        }
        label {
            font-weight: bold;
        }
        .stat {
            margin-bottom: 5px;
        }
        table {
            width: 100%; // Ensures the table takes the full width of its container
        }

        .green-text {
            color: #026f00;
        } /* Dark green */
        .yellow-text {
            color: #daa520;
        }
        .red-text {
            color: #c42f2f;
        } /* Firebrick red */
        .blue-text {
            color: blue;
        }
        .black-text {
            color: black;
        }
    }

    select {
        background-color: #6b6b6b;
        border: none;
        padding: 0 1em 0 0;
        margin: 0;
        width: 80px;
        color: #ffe3a1;
        border-radius: 3px;
    }

    button {
        background-color: #6b6b6b;
        border: none;
        color: #ffe3a1;
        text-align: center;
        text-decoration: none;
        border-radius: 3px;
    }

    .nav-links {
        list-style-type: none;
        padding: 0;
        margin: 0;
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 5px;
    }

    .nav-links li {
        margin-bottom: 10px;
    }

    .nav-links li:last-child {
        margin-bottom: 0;
    }

    .nav-links a {
        text-decoration: none;
        color: #007bff;
        font-weight: bold;
    }

    .nav-links a:hover {
        text-decoration: underline;
    }

    /* css to customize Leaflet default styles  */
    .popupCustom .leaflet-popup-tip,
    .popupCustom .leaflet-popup-content-wrapper {
        background: #e0e0e0;
        color: #234c5e;
    }
</style>
