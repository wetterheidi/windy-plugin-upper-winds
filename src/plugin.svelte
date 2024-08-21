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
        <h4>Click on map to generate an upper wind table</h4>
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
                        <th>ft <br />AGL</th>
                        <th>°</th>
                        <th>kt</th>
                        <th>hPa</th>
                        <th>{temperatureUnit}</th>
                        <th>{temperatureUnit}</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {#each flightLevels as { heightAGL, windDir, windSp, pressure, temperature, humidityWater, dewPointt }}
                        <tr
                            class:green-text={temperature > (freezingLevelAt-0.5) && temperature < (freezingLevelAt+0.5)}
                            class:blue-text={temperature <= (freezingLevelAt-0.5)}
                            class:red-text={temperature >= (freezingLevelAt+0.5)}
                        >
                            <td>{heightAGL}</td>
                            <td>{windDir}</td>
                            <td>{Math.round((windSp * 3.6) / 1.852)}</td>
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
                <strong>Settings (not operable yet): </strong><br />
                <h4>
                    <h4>
                        <div class="mb-3">
                            <label for="" class="form-label">Height: </label>
                            <select bind:value={settings.heightUnit} class="from-select">
                                <option value="" disabled>-- Select Unit --</option>
                                {#each heightUnitquestions as heightUnitquestion}
                                    <option value={heightUnitquestion.text}
                                        >{heightUnitquestion.text}</option
                                    >
                                {/each}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Increment: </label>
                            <select bind:value={settings.increment} class="from-select">
                                <option value="" disabled>-- Select Increment --</option>
                                {#each incrementquestions as incrementquestion}
                                    <option value={incrementquestion.text}
                                        >{incrementquestion.text}</option
                                    >
                                {/each}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Wind: </label>
                            <select bind:value={settings.windUnit} class="from-select">
                                <option value="" disabled>-- Select Unit --</option>
                                {#each windUnitquestions as windUnitquestion}
                                    <option value={windUnitquestion.text}
                                        >{windUnitquestion.text}</option
                                    >
                                {/each}
                            </select>
                        </div>
                    </h4>
                </h4>
            </h4>
        </div>
        <hr />
        <div style="text-align:center">
            <button on:click={() => downloadData(Format.FMT_CSV)}> Download CSV </button>
            <button on:click={() => downloadData(Format.FMT_JSON)}> Download JSON </button>
            <button on:click={() => downloadData(Format.FMT_HEIDIS)}> Download HEIDIS </button>
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
    import windyStore, { set } from '@windy/store';
    // see https://www.npmjs.com/package/export-to-csv
    import { mkConfig, generateCsv, asBlob } from 'export-to-csv';
    import { LatLon } from '@windycom/plugin-devtools/types/interfaces';
    import { Utility } from './classes//Utility.class';
    import metrics from '@windy/metrics';

    enum Format {
        FMT_CSV = 1,
        FMT_JSON,
        FMT_HEIDIS,
    }
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
    let temperatureUnit: string = Utility.findOutTemperatureUnit(273); //Kelvin in raw data
    let freezingLevelAt: number = 0;
    if (temperatureUnit === '°C') {
        freezingLevelAt = 0;
    } else if (temperatureUnit === '°F') {
        freezingLevelAt = 32;
    };

    let windUnit: string = Utility.findOutWindUnit(10); // m/s in raw data
    let altitudeUnit: string = Utility.findOutAltitudeUnit(100); // m in raw data

    if (temperatureUnit === '°C') {
        console.log('Celsius!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

    let settings = {
        heightUnit: 'Feet',
        increment: '1000',
        windUnit: 'kt',
    };

    let incrementquestions = [
        { text: '100' },
        { text: '200' },
        { text: '500' },
        { text: '1000' },
        { text: '2000' },
    ];
    let heightUnitquestions = [{ text: 'Feet' }, { text: 'Meter' }];
    let windUnitquestions = [{ text: 'kt' }, { text: 'm/s' }];

    //Hier wird die Höheneinheit gesetzt. Wie jetzt weiter?
    $: {
        console.log('---->', settings.increment);
    }
    $: {
        console.log('---->', settings.heightUnit);
    }
    $: {
        console.log('---->', settings.windUnit);
    }

    /* Add layer for lines to the map*/
    var activeLayer = L.featureGroup().addTo(map);
    var popup = L.popup({ autoClose: false, closeOnClick: false, closeButton: false });

    activeLayer.clearLayers();

    export const onopen = async (_params: { lat: any; lon: any }) => {
        if (!_params) {
            return; // Ignore null _params and do not execute further
        }

        popup
            .setLatLng([_params.lat, _params.lon])
            .setContent('Loading....')
            .addTo(activeLayer)
            .openOn(map);
        upperwind.setTime(windyStore.get('timestamp'));
        await upperwind.handleEvent(_params); // Wait for handleEvent to complete
        assignAnalysis(upperwind);
        popup.setContent(clickLocation);
    };

    const listener = () => {
        console.log('---redrawFinished', new Date(windyStore.get('timestamp')));
        //Versuch die Werte zu ändern, sobald die Zeit geändert wurde (geht noch nicht!)
        assignAnalysis(upperwind);
    };

    onMount(() => {
        /** Eventhandler for the click on the map*/
        singleclick.on('windy-plugin-upper-winds', async ev => {
            position = { lat: ev.lat, lon: ev.lon };
            await upperwind.handleEvent(ev); // Wait for handleEvent to complete
            assignAnalysis(upperwind);

            /* Create a Popup to show the clicked position*/
            popup
                .setLatLng([position.lat, position.lon])
                .setContent(clickLocation)
                .addTo(activeLayer)
                .openOn(map);
        });
        /** Eventhandler for stepping forward or backward in time*/
        bcast.on('paramsChanged', async () => {
            if (position === undefined) return;
            upperwind.setTime(windyStore.get('timestamp'));
            await upperwind.handleEvent(position); // Wait for handleEvent to complete
            assignAnalysis(upperwind);
        });

        console.log('Versuch 273: ' + metrics.temp.convertNumber(273, 2, '°F')); //Kelvin in raw data
        console.log('Versuch 273.15: ' + metrics.temp.convertNumber(273.15, 2)); //Kelvin in raw data
        console.log('Versuch283: ' + metrics.temp.convertNumber(283, 2)); //Kelvin in raw data
        console.log('Versuch 293: ' + metrics.temp.convertNumber(293, 2)); //Kelvin in raw data
        console.log('Versuch 190: ' + metrics.temp.convertNumber(190, 2)); //Kelvin in raw data
        console.log('Versuch 200: ' + metrics.temp.convertNumber(200, 2)); //Kelvin in raw data
        console.log('Versuch 210: ' + metrics.temp.convertNumber(210, 2)); //Kelvin in raw data
        console.log('Versuch 217.655: ' + metrics.temp.convertNumber(217.655, 2)); //Kelvin in raw data
        console.log('Versuch 356.12: ' + metrics.temp.convertNumber(356.12, 2)); //Kelvin in raw data
        console.log('Versuch 273.666: ' + metrics.temp.convertNumber(273.666, 2)); //Kelvin in raw data
        console.log('Versuch: ' + metrics.wind.convertNumber(10, 2)); // m/s in raw data
        console.log('Versuch: ' + metrics.altitude.convertNumber(100, 2)); // m in raw data
    });

    onDestroy(() => {
        bcast.off('redrawFinished', listener);
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

    /** Download the Data  */
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    // "ES6+ version for 2021; no 1MB limit either:"
    const saveTemplateAsFile = (filename: string, blob: Blob, mimeType: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = [mimeType, link.download, link.href].join(':');

        const evt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove();
    };

    function downloadData(format: Format) {
        if (format === Format.FMT_CSV) {
            const csvConfig = mkConfig({
                useKeysAsHeaders: true,
            });
            const csv = generateCsv(csvConfig)(flightLevels);
            const blob = asBlob(csvConfig)(csv);
            saveTemplateAsFile('flightLevels.csv', blob, 'text/csv;charset=utf-8');
        }
        if (format === Format.FMT_JSON) {
            const data = JSON.stringify(flightLevels, undefined, 2);
            const blob = new Blob([data], { type: 'text/json' });
            saveTemplateAsFile('flightLevels.json', blob, 'text/json');
        }
        if (format === Format.FMT_HEIDIS) {
            // which keys to extract into columns, by field order
            const sequence = [
                'pressure',
                'height',
                'heightAGL',
                'temperature',
                'dewPointt',
                'wind_u',
                'wind_v',
                'windDir',
                'windSp',
            ];
            const lineSeparator = `\n`;
            const fieldSeparator = ' ';
            const rowConverter = (row: any) => {
                return sequence
                    .map(field => `${row[field]}` + fieldSeparator)
                    .join('')
                    .slice(0, -1);
            };
            const data = flightLevels.map(rowConverter).join(lineSeparator);
            const blob = new Blob([data], { type: 'text/plain' });
            saveTemplateAsFile('flightLevels.txt', blob, 'text/plain');
        }
    }
</script>

<style lang="less">
    .weather-stats {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: ivory;
        text-align: center;
        th {
            color: black; /* Sets the text color of headers to black */
            background-color: #f0f0f0; /* Optional: sets a light gray background for better contrast */
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
            color: green;
        } /* Dark green */
        .yellow-text {
            color: #daa520;
        }
        .red-text {
            color: red;
        } /* Firebrick red */
        .blue-text {
            color: blue;
        }
        .black-text {
            color: black;
        }
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
</style>
