<div class="plugin__mobile-header">
    {title}
</div>
<section
    class="plugin__content"
    class:mobile-bottom-space={isMobile}
    class:half-position={halfPosition}
>
    <div class="position-sentinel" bind:this={sentinelEl}></div>
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {title} <span style="font-size: 0.5em;">v{version}</span>
    </div>

    {#if overlayWarning}
        <div class="overlay-warning">{overlayWarning}</div>
    {/if}
    {#if !ready}
        <h4><strong>Tap or click on the map to generate an upper wind table.</strong></h4>
        <p>
            On mobile, slide this panel down to see the map, or long-press the map and choose
            "Upper winds".
        </p>
    {:else if errorHandlerOutput}
        <h4><strong>No forecast available for {forecastDateString}</strong></h4>
    {:else}
        <div class="info-block">
            <div><strong>Location:</strong> {clickLocation}</div>
            <div><strong>Model:</strong> {forecastModel} &middot; <strong>Elevation:</strong> {elevation}</div>
            <div class="time-row">
                <strong>Forecast time:</strong>
                <button on:click={() => stepTime(-1)} aria-label="Previous forecast step">&lsaquo;</button>
                <span>{forecastDateString}</span>
                <button on:click={() => stepTime(1)} aria-label="Next forecast step">&rsaquo;</button>
            </div>
            <div>
                <strong
                    >Mean wind {lowerAltitudeInput}&ndash;{upperAltitudeInput}
                    {altitudeUnit}
                    {settings.referenceLevel}:</strong
                >
                {meanWindDirection}&deg; {meanWindSpeed} {windUnit}
            </div>
        </div>
        <div class="table-heading">
            <hr />
            <h4><strong>Upper winds, temperature and humidity</strong></h4>
        </div>
        <div class="weather-stats" bind:this={tableEl}>
            <table>
                <thead>
                    <tr>
                        <th>h<br /><span class="unit">{altitudeUnit} {settings.referenceLevel}</span></th>
                        <th>Dir<br /><span class="unit">°</span></th>
                        <th>Speed<br /><span class="unit">{windUnit}</span></th>
                        <th>p<br /><span class="unit">hPa</span></th>
                        <th>T<br /><span class="unit">{temperatureUnit}</span></th>
                        <th>Td<br /><span class="unit">{temperatureUnit}</span></th>
                        <th>RHw<br /><span class="unit">%</span></th>
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
        <div class="bottom-controls">
        <hr />
        <div>
            <h4><strong>Settings:</strong></h4>
            <div class="mb-3">
                <label for="increment-select" class="form-label"
                    >Choose interpolation step:
                </label>
                <select id="increment-select" bind:value={settings.increment}>
                    <option value="" disabled>-- Select Increment --</option>
                    {#each incrementquestions as incrementquestion}
                        <option value={incrementquestion.text}>{incrementquestion.text}</option>
                    {/each}
                </select>
                <span class="form-label">{altitudeUnit}</span>
            </div>
            <div class="mb-3">
                <label for="reference-select" class="form-label"
                    >Choose reference level for altitude:
                </label>
                <select id="reference-select" bind:value={settings.referenceLevel}>
                    <option value="" disabled>-- Select Reference --</option>
                    {#each referencelevelquestions as referencelevelquestion}
                        <option value={referencelevelquestion.text}
                            >{referencelevelquestion.text}</option
                        >
                    {/each}
                </select>
            </div>
        </div>
        <hr />
        <div>
            <h4><strong>Calculate mean wind between:</strong></h4>
            <div class="mb-3">
                <label for="lower-altitude" class="form-label">Lower altitude: </label>
                <input
                    id="lower-altitude"
                    type="text"
                    inputmode="numeric"
                    bind:value={lowerAltitudeInput}
                />
                <span class="form-label">{altitudeUnit} {settings.referenceLevel}</span>
            </div>
            <div class="mb-3">
                <label for="upper-altitude" class="form-label">Upper altitude: </label>
                <input
                    id="upper-altitude"
                    type="text"
                    inputmode="numeric"
                    bind:value={upperAltitudeInput}
                />
                <span class="form-label">{altitudeUnit} {settings.referenceLevel}</span>
            </div>
            <div class="mb-3">
                <strong>Mean wind: {meanWindDirection}° {meanWindSpeed} {windUnit}</strong>
            </div>
        </div>
        </div>
    {/if}
    <hr />
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { isMobile } from '@windy/rootScope';
    import { onDestroy, onMount, tick } from 'svelte';
    import config from './pluginConfig';
    import { singleclick } from '@windy/singleclick';
    import { UpperWind } from './classes/UpperWind.class';
    import windyStore from '@windy/store';
    import { LatLon } from '@windycom/plugin-devtools/types/interfaces';
    import { Utility } from './classes/Utility.class';

    let ready = false;
    let flightLevels: any[] = [];
    let clickLocation = '';
    let forecastDate: any = '';
    let forecastDateString: string = '';
    let forecastModel = '';
    let elevation: any;
    let position: LatLon | undefined = undefined;
    let meanWindDirection: number;
    let meanWindSpeed: number;
    let destroyed: boolean = false;

    const { title } = config;
    const { version } = config;
    const upperwind = new UpperWind();

    /* Take user settings for Table*/
    /* Settings for temperature*/
    let temperatureUnit: string = Utility.findOutTemperatureUnit(273.15);
    let freezingLevelAt: number = 0;
    function freezingLevel() {
        if (temperatureUnit === '°C') {
            freezingLevelAt = 0;
        } else if (temperatureUnit === '°F') {
            freezingLevelAt = 32;
        }
        return freezingLevelAt;
    }
    freezingLevelAt = freezingLevel();

    /* Settings for wind*/
    let windUnit: string = Utility.findOutWindUnit(10);
    let altitudeUnit: string = Utility.findOutAltitudeUnit(100);
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
    let lowerAltitudeInput: string = '0';
    let upperAltitudeInput: string = '3000';
    let errorHandlerOutput: boolean = false;
    let overlayWarning: string = '';
    let pluginOpenedHandler: (() => Promise<void>) | null = null;
    let paramsChangedHandler: (() => Promise<void>) | null = null;
    let pluginClosedHandler: (() => void) | null = null;
    let singleclickHandler: ((ev: LatLon) => Promise<void>) | null = null;
    let halfPosition: boolean = false;
    let sentinelEl: HTMLElement;
    let tableEl: HTMLElement | undefined;
    let positionObserver: IntersectionObserver | null = null;

    //On settings changed, recalculate upper winds table
    $: {
        upperwind._lowerLevel = lowerAltitudeInput;
        upperwind._upperLevel = upperAltitudeInput;
        errorHandlerOutput = upperwind._errorhandler;

        const heightAGLArray = flightLevels.map(row => row.heightAGL);
        const heightMSLArray = flightLevels.map(row => row.height);
        const wind_uArray = flightLevels.map(row => row.wind_u);
        const wind_vArray = flightLevels.map(row => row.wind_v);

        if (settings.referenceLevel == 'AGL') {
            meanWindDirection = Utility.Mittelwind(
                heightAGLArray,
                wind_uArray,
                wind_vArray,
                Number(upperwind._lowerLevel),
                Number(upperwind._upperLevel),
            )[0];
            meanWindSpeed = Utility.Mittelwind(
                heightAGLArray,
                wind_uArray,
                wind_vArray,
                Number(upperwind._lowerLevel),
                Number(upperwind._upperLevel),
            )[1];
        } else if (settings.referenceLevel == 'AMSL') {
            meanWindDirection = Utility.Mittelwind(
                heightMSLArray,
                wind_uArray,
                wind_vArray,
                Number(upperwind._lowerLevel),
                Number(upperwind._upperLevel),
            )[0];
            meanWindSpeed = Utility.Mittelwind(
                heightMSLArray,
                wind_uArray,
                wind_vArray,
                Number(upperwind._lowerLevel),
                Number(upperwind._upperLevel),
            )[1];
        }

        upperwind._step = Number(settings.increment);
        upperwind._reference = settings.referenceLevel;
        const fl = upperwind.restratify();
        if (fl) {
            flightLevels = fl;
        }
    }

    /* Add layer for lines to the map*/
    var activeLayer = L.featureGroup().addTo(map);
    var popup = L.popup({ autoClose: false, closeOnClick: false, closeButton: false });

    // Make the popup draggable
    let draggablePopup: any;
    async function makePopupDraggable() {
        try {
            if (!draggablePopup) {
                draggablePopup = new L.Draggable((popup as any)._container, (popup as any)._wrapper);
                draggablePopup.enable();

                draggablePopup.on('dragend', async function () {
                    if (destroyed) return;
                    const containerPoint = map.layerPointToContainerPoint(draggablePopup._newPos);
                    const latlng = map.containerPointToLatLng(containerPoint);
                    popup.setLatLng(latlng);
                    position = { lat: latlng.lat, lon: latlng.lng };
                    popup.setContent('Loading....');
                    upperwind.setTime(windyStore.get('timestamp'));
                    await upperwind.handleEvent(position);
                    assignAnalysis(upperwind);
                    popup.setContent(clickLocation);
                });
            }
        } catch (_e) {
            draggablePopup = null;
        }
    }

    activeLayer.clearLayers();

    /** Called by Windy when the plugin is opened; params are set when
     * opened via context menu or URL */
    export const onopen = (_params?: { lat: any; lon: any }) => {
        destroyed = false;
        if (_params && _params.lat !== undefined) {
            position = { lat: _params.lat, lon: _params.lon };
        }
    };

    /** Jump to the previous/next forecast step of the model. The fullscreen
     * plugin covers Windy's timeline on mobile, so time must be controlled
     * from within the plugin. Setting the timestamp fires paramsChanged,
     * which refreshes the table. */
    function stepTime(direction: number) {
        const t = upperwind.neighbourTimestamp(direction);
        if (t !== undefined) {
            windyStore.set('timestamp', t);
        }
    }

    /** Fetch the forecast for the current position and show popup and table */
    async function showPosition() {
        if (position === undefined) return;
        const warning = Utility.checkOverlay();
        if (warning) overlayWarning = warning;
        upperwind.setTime(windyStore.get('timestamp'));
        popup
            .setLatLng([position.lat, position.lon])
            .setContent('Loading....')
            .addTo(activeLayer)
            .openOn(map);
        makePopupDraggable();
        await upperwind.handleEvent(position);
        assignAnalysis(upperwind);
        popup.setContent(clickLocation);
    }

    /** Pan the map so the position is centered in the part of the map that
     * is not covered by the plugin panel. The top of the sentinel element
     * marks where the panel begins on screen. */
    function panToVisiblePart(lat: number, lon: number) {
        const latlng = new L.LatLng(lat, lon);
        if (!isMobile || !sentinelEl) {
            map.panTo(latlng);
            return;
        }
        const mapRect = map.getContainer().getBoundingClientRect();
        const panelTop = sentinelEl.getBoundingClientRect().top;
        const visibleHeight = Math.max(panelTop - mapRect.top, 100);
        const offsetY = mapRect.height / 2 - visibleHeight / 2;
        const centerPoint = map.project(latlng, map.getZoom()).add([0, offsetY]);
        map.panTo(map.unproject(centerPoint, map.getZoom()));
    }

    /** Scroll the table to its bottom so that the near-ground values,
     * usually the most important ones, are visible right away */
    async function scrollTableToBottom() {
        await tick(); // wait until the new rows are rendered
        if (tableEl) {
            tableEl.scrollTop = tableEl.scrollHeight;
        }
    }

    onMount(() => {
        destroyed = false;

        if (isMobile && sentinelEl) {
            // Windy does not expose the bottom sheet position, so detect it:
            // only in fullscreen position the top of the plugin content sits
            // in the upper 30% of the screen
            positionObserver = new IntersectionObserver(
                ([entry]) => {
                    halfPosition = !entry.isIntersecting;
                },
                { rootMargin: '0px 0px -70% 0px' },
            );
            positionObserver.observe(sentinelEl);
        }

        singleclickHandler = async ev => {
            if (destroyed) return;
            position = { lat: ev.lat, lon: ev.lon };
            await showPosition();
            panToVisiblePart(ev.lat, ev.lon);
        };
        singleclick.on('windy-plugin-upper-winds', singleclickHandler);

        pluginOpenedHandler = async () => {
            if (destroyed || position === undefined) return;
            await showPosition();
            panToVisiblePart(position.lat, position.lon);
        };
        bcast.on('pluginOpened', pluginOpenedHandler);

        paramsChangedHandler = async () => {
            if (destroyed || position === undefined) return;
            const warning = Utility.checkOverlay();
            if (warning) overlayWarning = warning;
            upperwind.setTime(windyStore.get('timestamp'));
            popup.setContent('Loading....');
            await upperwind.handleEvent(position);
            assignAnalysis(upperwind);
            popup.setContent(clickLocation);
        };
        bcast.on('paramsChanged', paramsChangedHandler);

        pluginClosedHandler = () => {
            removePopup();
        };
        bcast.on('pluginClosed', pluginClosedHandler);
    });

    /** Windy's Leaflet throws when removing a layer that is not on the map,
     * e.g. when the plugin is closed before a position was picked */
    function removePopup() {
        if (map.hasLayer(popup)) {
            popup.remove();
        }
    }

    onDestroy(() => {
        destroyed = true;
        removePopup();
        if (draggablePopup) {
            draggablePopup.disable();
            draggablePopup.off('dragend');
        }
        if (paramsChangedHandler) bcast.off('paramsChanged', paramsChangedHandler);
        if (pluginOpenedHandler) bcast.off('pluginOpened', pluginOpenedHandler);
        if (pluginClosedHandler) bcast.off('pluginClosed', pluginClosedHandler);
        if (singleclickHandler) singleclick.off('windy-plugin-upper-winds', singleclickHandler);
        if (positionObserver) positionObserver.disconnect();
        if (map.hasLayer(activeLayer)) {
            activeLayer.remove();
        }
    });

    /* Assigns the Analysis to a location and a model*/
    function assignAnalysis(upperwind: UpperWind) {
        temperatureUnit = Utility.findOutTemperatureUnit(0);
        altitudeUnit = Utility.findOutAltitudeUnit(1000);
        windUnit = Utility.findOutWindUnit(10);
        freezingLevelAt = freezingLevel();

        clickLocation = upperwind.clickLocation;
        flightLevels = upperwind.flightLevels;

        forecastDate = new Date(windyStore.get('timestamp'));
        let year = forecastDate.getFullYear();
        let month = forecastDate.getMonth() + 1;
        let day = forecastDate.getDate();
        let hours = forecastDate.getHours();
        forecastDateString = year + '-' + month + '-' + day + ' ' + hours + ':00 loc ';
        forecastModel = upperwind.model;
        elevation =
            (upperwind.elevation * 3.28084).toFixed(0) + ' ft/ ' + upperwind.elevation + ' m';
        ready = true;
        scrollTableToBottom();
    }
</script>

<style lang="less">
    .weather-stats {
        padding: 0 5px 5px; // no top padding, rows would show above the sticky header
        background-color: #f8f8f8;
        text-align: center;
        max-height: 45vh;
        overflow: auto;
        table {
            width: 100%;
            table-layout: fixed; // equal columns, table never wider than the panel
            border-collapse: separate; // sticky th is unreliable with collapsed borders
            border-spacing: 0;
        }
        th,
        td {
            width: 14.28%;
        }
        th {
            position: sticky; // keep the header visible while scrolling
            top: 0;
            color: black;
            background-color: #e5e5e5;
            .unit {
                font-weight: normal;
            }
        }
        td {
            text-align: right;
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

    select,
    input {
        background-color: #6b6b6b;
        border: none;
        padding: 6px 8px;
        margin: 0;
        min-height: 32px;
        width: 90px;
        color: #ffe3a1;
        border-radius: 3px;
    }

    .mb-3 {
        margin-bottom: 10px;
    }

    .info-block {
        margin: 8px 0;
        line-height: 1.5;
        div {
            margin-bottom: 4px;
        }
        .time-row {
            display: flex;
            align-items: center;
            gap: 6px;
            button {
                background-color: #6b6b6b;
                color: #ffe3a1;
                border: none;
                border-radius: 3px;
                min-width: 40px;
                min-height: 30px;
                font-size: 1.2em;
                line-height: 1;
            }
        }
    }

    .position-sentinel {
        height: 1px;
    }

    .half-position .bottom-controls {
        // settings and mean wind input are hidden while the bottom sheet is
        // in its half position, so the table bottom stays visible
        display: none;
    }

    .mobile-bottom-space {
        // Windy treats the mobile panel as a bottom sheet: in half position
        // a swipe up expands the panel instead of scrolling the content, so
        // the content can only be scrolled in fullscreen. Everything above
        // the table is kept as compact as possible and the table small
        // enough that its bottom edge (the near-ground values) stays
        // visible in the half position.
        .plugin__title {
            display: none; // the mobile header already shows the title
        }
        .table-heading {
            display: none;
        }
        .weather-stats {
            max-height: 28vh;
        }
    }

    .overlay-warning {
        background-color: #ffd700;
        color: #333;
        padding: 8px;
        border-radius: 3px;
        margin-bottom: 8px;
        font-size: 0.85em;
    }
</style>
