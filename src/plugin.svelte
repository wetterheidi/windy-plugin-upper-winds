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
        <h4>{clickLocation}</h4>
        <h4>{forecastDate}</h4>
        <hr />
        <h4>Upper winds, temperature and humidity</h4>
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
                        <th>ft</th>
                        <th>°</th>
                        <th>kt</th>
                        <th>hPa</th>
                        <th>°C</th>
                        <th>°C</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {#each flightLevels as { height, windDir, windSp, pressure, temperature, humidityWater, dewPointt }}
                        <tr
                            class:green-text={temperature > -0.5 && temperature < 0.5}
                            class:blue-text={temperature <= -0.5}
                            class:red-text={temperature >= 0.5}
                        >
                            <td>{height}</td>
                            <td>{windDir}0</td>
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
        <div style="text-align:center">
            <button on:click={() => downloadData(Format.FMT_CSV)}> Download CSV </button>
            <button on:click={() => downloadData(Format.FMT_JSON)}> Download JSON </button>
            <button on:click={() => downloadData(Format.FMT_HEIDIS)}> Download HEIDIS </button>
        </div>
    {/if}
    <hr />
</section>

<script lang="ts">
    /*Vorlage für Onclick Aktion des Downloadbuttons:
    <button on:click={downloadData}> Download data </button> */

    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';
    import { singleclick } from '@windy/singleclick';
    import { UpperWind } from './classes/UpperWind.class';
    import windyStore from '@windy/store';
    // see https://www.npmjs.com/package/export-to-csv
    import { mkConfig, generateCsv, asBlob } from 'export-to-csv';
    import { LatLon } from '@windycom/plugin-devtools/types/interfaces';
    enum Format {
        FMT_CSV = 1,
        FMT_JSON,
        FMT_HEIDIS,
    }
    let ready = false;
    let flightLevels: any[] = [];
    let clickLocation = '';
    let filteredFlightLevels: any[] = [];
    let forecastDate = '';

    const { title } = config;
    const { version } = config;
    const contrail = new UpperWind();

    /* Add layer for lines to the map*/
    var activeLayer = L.featureGroup().addTo(map);
    var popup = L.popup({ autoClose: false, closeOnClick: false, closeButton: false });

    activeLayer.clearLayers();

    export const onopen = async (_params: { lat: any; lon: any }) => {
        if (!_params) {
            return; // Ignore null _params and do not execute further
        }
        await contrail.handleEvent(_params); // Wait for handleEvent to complete
        assignAnalysis(contrail);
    };

    const listener = () => {
        console.log('---redrawFinished', new Date(windyStore.get('timestamp')));
        //Versuch die Werte zu ändern, sobald die Zeit geändert wurde (geht noch nicht!)
        assignAnalysis(contrail);
    };
    let position: LatLon | undefined = undefined;

    onMount(() => {
        singleclick.on('windy-plugin-upper-winds', async ev => {
            position = { lat: ev.lat, lon: ev.lon };
            await contrail.handleEvent(ev); // Wait for handleEvent to complete
            assignAnalysis(contrail);
            /* Create a Popup to show the clicked position*/
            popup
                .setLatLng([position.lat, position.lon])
                .setContent(clickLocation)
                .addTo(activeLayer)
                .openOn(map);
        });
        bcast.on('paramsChanged', async () => {
            if (position === undefined) return;
            contrail.setTime(windyStore.get('timestamp'));
            await contrail.handleEvent(position); // Wait for handleEvent to complete
            assignAnalysis(contrail);
        });
    });

    onDestroy(() => {
        bcast.off('redrawFinished', listener);
    });

    /* Assigns the Analysis to a location and a model
    TODO: Make it possible to go foreward in time
    */
    function assignAnalysis(contrail: UpperWind) {
        clickLocation = contrail.clickLocation;
        flightLevels = contrail.flightLevels;
        filteredFlightLevels = flightLevels.filter(
            level => level.temperature <= level.applemanTemp,
        );
        //Original version
        //forecastDate = 'Forecast for ' + contrail.forecastDate + ' using model ' + contrail.model;
        // Versuch!!
        forecastDate =
            'Forecast for ' +
            new Date(windyStore.get('timestamp')) +
            ' using model ' +
            contrail.model;
        ready = true;
    }

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
                'height',
                'pressure',
                'temperature',
                'humidityWater',
                'wind_u',
                'wind_v',
                'windDir',
                'windSp',
                'dewPointt',
                'human',
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
