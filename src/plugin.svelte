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
        <h4>Click on map to generate an analysis</h4>
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
                        <th>RHw</th>
                    </tr>
                    <tr>
                        <th>ft</th>
                        <th>°</th>
                        <th>kt</th>
                        <th>hPa</th>
                        <th>°C</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {#each flightLevels as { height, windDirection, windSpeed, pressure, temperature, humidityWater }}
                        <tr
                            class:green-text={temperature > -0.5 && temperature < 0.5}
                            class:blue-text={temperature <= -0.5}
                            class:red-text={temperature >= 0.5}
                        >
                            <td>{height}</td>
                            <td>{windDirection}</td>
                            <td>{windSpeed}</td>
                            <td>{pressure}</td>
                            <td>{temperature}</td>
                            <td>{humidityWater}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <hr />
    {/if}
    <hr />
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';
    import { singleclick } from '@windy/singleclick';
    import { Contrail } from './classes/Contrail.class';

    let ready = false;
    let flightLevels: any[] = [];
    let clickLocation = '';
    let filteredFlightLevels: any[] = [];
    let forecastDate = '';

    const { title } = config;
    const { version } = config;
    const contrail = new Contrail();

    export const onopen = async (_params: { lat: any; lon: any }) => {
        if (!_params) {
            return; // Ignore null _params and do not execute further
        }

        await contrail.handleEvent(_params); // Wait for handleEvent to complete
        assignAnalysis(contrail);
    };

    onMount(() => {
        singleclick.on('windy-plugin-upper-winds', async ev => {
            await contrail.handleEvent(ev); // Wait for handleEvent to complete
            assignAnalysis(contrail);
        });
    });

    onDestroy(() => {
        // Your plugin was destroyed
    });

    function assignAnalysis(contrail: Contrail) {
        clickLocation = contrail.clickLocation;
        flightLevels = contrail.flightLevels;
        filteredFlightLevels = flightLevels.filter(
            level => level.temperature <= level.applemanTemp,
        );
        forecastDate = 'Forecast for ' + contrail.forecastDate + ' using model ' + contrail.model;
        ready = true;
    }
</script>

<style lang="less">
    .weather-stats {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: ivory;
        th {
            color: black; /* Sets the text color of headers to black */
            background-color: #f0f0f0; /* Optional: sets a light gray background for better contrast */
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
