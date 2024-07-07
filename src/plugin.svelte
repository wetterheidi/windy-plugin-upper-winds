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
        In these charts, the pressure difference between

        <select bind:value={csIndex} id="CS">
            {#each crossSections as cs, index}
                <option value={index}>{cs.start} - {cs.end}</option>
            {/each}
        </select>
        is represented.

        {#each crossSections[csIndex].models as model}
            {@const cs = crossSections[csIndex]}
            <h2 class="mb-10">{cs.windName} Chart {model}</h2>
            <Chart
                pointTop={endPoints[cs.start]}
                pointBottom={endPoints[cs.end]}
                forecastModel={nwm[model]}
                nameOfThisPlugin={name}
                topText={cs.topText}
                bottomText={cs.bottomText}
            />
                        <hr />
        {/each}
        
        {crossSections[csIndex].remark}
       
    </p>
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import config from './pluginConfig';
    import Chart from './Chart.svelte';
    import type { LatLon } from '@windy/interfaces.d';
    import { map as windyMap } from '@windy/map';
    import windyStore from '@windy/store';
    import { onDestroy, onMount } from 'svelte';
    //Imports für Interpolation von Werten
    import { getLatLonInterpolator } from '@windy/interpolator';
    import type { CoordsInterpolationFun } from '@windy/interpolator';
    import { wind2obj } from '@windy/utils';
    import metrics from '@windy/metrics';

    /* Variables are set in src/static */
    import { crossSections, endPoints, nwm } from 'src/static';

    const { title, name } = config;

    let csIndex = 4; // set default cross section

    // https://gis.stackexchange.com/questions/123542/leafletjs-get-latlng-center-position-of-polyline
    function midPoint(src: LatLon, dst: LatLon): LatLon {
        let srcLatRad = src.lat * (Math.PI / 180);
        let dstLatRad = dst.lat * (Math.PI / 180);
        let middleLatRad = Math.atan(
            Math.sinh(
                Math.log(
                    Math.sqrt(
                        (Math.tan(dstLatRad) + 1 / Math.cos(dstLatRad)) *
                            (Math.tan(srcLatRad) + 1 / Math.cos(srcLatRad)),
                    ),
                ),
            ),
        );
        return { lat: middleLatRad * (180 / Math.PI), lon: (src.lon + dst.lon) / 2 };
    }

    function csName(i: number): string {
        return `${crossSections[i].start} - ${crossSections[i].end}<br />`;
    }

    /* Show wind overlay at 700 hPa*/
    windyStore.set('overlay', 'wind');
    windyStore.set('level', '700h');

    /* Center map (and place picker with wind direction and speed to) at a location refering to the cross section */
    $: {
        const cs = crossSections[csIndex];
        const start: LatLon = endPoints[cs.start];
        const end: LatLon = endPoints[cs.end];
        drawLine(start, end);
        popupInfoFor(csIndex);
    }

    /* Add layer for lines to the map*/
    var activeLine = L.featureGroup().addTo(windyMap);
    let openedPopup: L.Popup | null = null;

    function drawLine(start: LatLon, end: LatLon) {
        /*Delete existing line*/
        activeLine.clearLayers();
        /* Draw line between start and end location */
        L.polyline(
            [
                [start.lat, start.lon],
                [end.lat, end.lon],
            ],
            { color: 'red' },
        ).addTo(activeLine);
    }

    function popupInfo(middleLatitude: number, middleLongitude: number) {
        /* Interpolate wind values for the selected cross section*/
        getLatLonInterpolator().then((interpolateLatLon: CoordsInterpolationFun | null) => {
            let html = csName(csIndex);
            const [lat, lon] = [middleLatitude, middleLongitude];

            if (!interpolateLatLon) {
                html += '<tr green-text > Do not reload this plugin.<br /> Start it again!';
            } else if (windyStore.get('overlay') !== 'wind') {
                html +=
                    'For sake of the simplicity, we<br />interpolate only wind values.<br />Please select wind overlay.';
            } else {
                // Interpolated values can be either invalid (NaN, null, -1)
                // or array of numbers
                const interpolated = interpolateLatLon({ lat, lon });

                if (Array.isArray(interpolated)) {
                    // I everything works well, we should get raw meterological values
                    const { dir, wind } = wind2obj(interpolated);

                    // This will convert wind speed form m/s to user's preferred units
                    const windSpeed = metrics.wind.convertValue(wind);

                    html += `<font color = red> Wind: ${dir}° ${windSpeed}<br /></font>`;
                } else {
                    html += 'No interpolated values available for this position';
                }
            }

            /*Place Popup Marker in the middle of the cross section*/
            openedPopup = new L.Popup()
                .setLatLng([middleLatitude, middleLongitude])
                .setContent(html)
                .openOn(windyMap);
            // windyMap.panTo([middleLatitude, middleLongitude]);
        });
    }

    // get locations for csIndex, compute midpoint and create popup
    function popupInfoBetween(start: LatLon, end: LatLon) {
        let midpoint = midPoint(start, end);
        popupInfo(midpoint.lat, midpoint.lon);
        var bounds = new L.LatLngBounds([
            [Math.max(start.lat, end.lat), Math.max(start.lon, end.lon)],
            [Math.min(start.lat, end.lat), Math.min(start.lon, end.lon)],
        ]);
        // Wait for popup placement to finish before fitting map
        /* Windy bug:  They have modified the fitBounds function to fit the map when the pane is open,   but still use the original map width. So padding:[ half of pane width + your padding, your padding ].*/

        setTimeout(() => windyMap.fitBounds(bounds, { padding: [395, 20] }), 100);
    }

    // get locations for csIndex, compute midpoint and create popup
    function popupInfoFor(index: number) {
        const cs = crossSections[index];
        popupInfoBetween(endPoints[cs.start], endPoints[cs.end]);
    }

    let timeChangedEventId: any;

    onMount(() => {
        console.log('Mount');
        timeChangedEventId = windyStore.on('timestamp', () => {
            popupInfoFor(csIndex);
        });
    });

    onDestroy(() => {
        windyStore.off('timestamp', timeChangedEventId);
        openedPopup?.remove();
        windyMap.removeLayer(activeLine);
    });
</script>

<style lang="less">
    p {
        line-height: 1.8;
    }
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

</style>
