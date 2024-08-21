import store from '@windy/store';
import reverseName from '@windy/reverseName';
import windyFetch from '@windy/fetch';
import {
    MeteogramDataPayload,
    MeteogramDataHash,
} from '@windycom/plugin-devtools/types/interfaces';
import metrics from '@windy/metrics';
import { Sounding } from './Sounding.interface';
import { Utility } from './Utility.class';


export class UpperWind {

    /** The raw data from Windy - arranged by pressure */
    private _rawdata: Sounding[] = [];
    /** The final interpolated data - arranged by flight levels */
    private _flightLevels: Sounding[] = [];
    /** Human readable location of click */
    private _clickLocation = '';
    /** Date of forecast */
    private _forecastDate = 0;
    /** Model used */
    private _model = '';
    /** The forecast nearest to current time */
    private _forecastColumn = 0;
    /** Forecast timestamp */
    private _timestamp: number = Date.now();
    /** Terrain elevation */
    private _elevation = 0;
    /** Step (i.e. height increment to interpolate) */
    private _step = 0;


    setTime(t: number) {
        this._timestamp = t;
    }

    get getTime() {
        return this._timestamp;
    }

    /** Return the final elevation */
    get elevation() {
        return this._elevation;
    }

    /** Return step */
    get step() {
        return this._step;
    }

    /** Return the final data */
    get flightLevels() {
        return this._flightLevels;
    }

    /** Return the location */
    get clickLocation() {
        return this._clickLocation;
    }

    get forecastDate() {
        const date = new Date(this._forecastDate);
        //Versuch Zeit akualisieren
        //const date = new Date(store.get('timestamp'));
        return date.toString();
    }

    get model() {
        return this._model;
    }

    /** Handle the click event (The request for the upper wind analysis) */
    async handleEvent(ev: { lat: any; lon: any }) {
        try {
            const product = await store.get('product'); // Retrieve product (forecast model) asynchronously
            const locationObject = await reverseName.get({ lat: ev.lat, lon: ev.lon }); // Retrieve the location data
            this._clickLocation = Utility.locationDetails(locationObject); // Convert to human readable
            const weatherData = await this.fetchData(ev.lat, ev.lon, product); // Retrieve the sounding from location
            this._elevation = await Utility.getElevation(ev.lat, ev.lon); // Get elevation data
            this._step = 1000; // set height increment to interpolate
            this.findNearestColumn(weatherData.data.data.hours);
            this._forecastDate = weatherData.data.data.hours[this._forecastColumn];
            this._model = weatherData.data.header.model;
            this.updateWeatherStats(weatherData.data); // Interpret the data
        } catch (error) {
            console.error('* * * An error occurred:', error);
        }
    }

    private findNearestColumn(epoch: number[]) {

        let closestIndex = -1;
        let closestDiff = Infinity;

        // Iterate through the hours array to find the closest timestamp
        for (let i = 0; i < epoch.length; i++) {
            const diff = Math.abs(epoch[i] - this.getTime);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestIndex = i;
            }
        }

        // Set this._forecastColumn to the index of the closest timestamp
        this._forecastColumn = closestIndex;
    }

    /** Call the Windy API for the sounding forecast */
    private fetchData(lat: any, lon: any, product: any) {
        return windyFetch.getMeteogramForecastData(product, { lat, lon });
    }

    /**
     * Processes the weather data retrieved from the API, calculates additional columns,
     * and stratifies the data for further use.
     * 
     * @param {MeteogramDataPayload} weatherData - The weather data payload retrieved from the API.
     */
    private updateWeatherStats = (weatherData: MeteogramDataPayload) => {
        this._rawdata = []; // Array to store data for each layer

        // Loop over all properties in weatherData.data.data
        for (const key in weatherData.data) {
            if (key.startsWith('gh-')) {
                const suffix = key.split('gh-')[1]; // Get the suffix to match other data
                const tempKey = `temp-${suffix}`;
                const humidityKey = `rh-${suffix}`;
                const dewpointKey = `dewpoint-${suffix}`;
                const wind_uKey = `wind_u-${suffix}`;
                const wind_vKey = `wind_v-${suffix}`;
                const human = '';

                const pressure = +suffix.slice(0, -1);
                const heightInMeters = +weatherData.data[key as keyof MeteogramDataHash][this._forecastColumn];
                const height = +(heightInMeters * 3.28084).toFixed(0); // Convert to feet
                const heightAGL = +((heightInMeters - this.elevation) * 3.28084).toFixed(this._forecastColumn); // Convert to AGL
                //First get u and v component of wind
                const wind_u = +weatherData.data[wind_uKey as keyof MeteogramDataHash][this._forecastColumn].toFixed(0);
                const wind_v = +weatherData.data[wind_vKey as keyof MeteogramDataHash][this._forecastColumn].toFixed(0);
                //Then calculate wind direction and speed using Utility class
                const windDir = +(Utility.windDirection(wind_u, wind_v)).toFixed(0); // Calculate wind direction
                const windSp = +(Utility.windSpeed(wind_u, wind_v)).toFixed(0); // Calculate wind speed
                const temperature = +(metrics.temp.convertNumber(weatherData.data[tempKey as keyof MeteogramDataHash][this._forecastColumn])).toFixed(0); // Convert Kelvin to User Settings
                const humidityWater = +weatherData.data[humidityKey as keyof MeteogramDataHash][this._forecastColumn].toFixed(0);
                const dewPointt = +(metrics.temp.convertNumber(weatherData.data[dewpointKey as keyof MeteogramDataHash][this._forecastColumn])).toFixed(0); // Convert Kelvin to User Settings


                this._rawdata.push({
                    pressure,
                    height,
                    heightAGL,
                    temperature,
                    humidityWater,
                    wind_u,
                    wind_v,
                    windDir,
                    windSp,
                    dewPointt,
                    human,
                });
            }
        }
        // Sorting the array by height in descending order
        this._rawdata.sort((a, b) => b.height - a.height);

        console.log('Processed Layers Data:', this._rawdata);
        this._flightLevels = this.stratify(this._rawdata);
        console.log('Stratified Data:', this.flightLevels);
    };


    private stratify(data: Sounding[]) {
        const result = [];
        // Define the range of heights for interpolation
        // Define start height so that AGL is rounded to 1000 ft
        const startHeight = (Math.floor((data[0].height - this.elevation * 3.28084) / 1000) * 1000 + (this.elevation * 3.28084)); // Highest point (AMSL)
        // Lowest point above ground level, rounded down to nearest 500, substract 500 to find ground level
        let endHeight = Math.ceil((data[data.length - 1].height + this.elevation * 3.28084) / 500) * 500 - 500;
        console.log('end height referring to AMSL: ' + endHeight + ' Elevation: ' + this.elevation * 3.28084);
        // Avoiding NaN in pressure values greater then 1000 hPa
        if (isNaN(data[data.length - 1].pressure)) {
            //data[data.length - 1].pressure = data[data.length - 2].pressure + (data[data.length - 2].height / 32);
            data[data.length - 1].pressure = Utility.calculatePressure((data[data.length - 2].pressure), (data[data.length - 2].height));
            console.log('berechneter Druck: ' + data[data.length - 1].pressure);
        } else if (isNaN(data[data.length - 2].pressure)) {
            data[data.length - 2].pressure = Utility.calculatePressure((data[data.length - 3].pressure), (data[data.length - 3].height));
            console.log('berechneter Druck: ' + data[data.length - 2].pressure);
        }

        const step = this._step;
        //const step: number = 1000;

        if (endHeight < 0) {
            endHeight = 0;
        }

        let previousHuman = '';
        for (let height = startHeight; height >= endHeight; height -= step) {
            /* Flexible steps depending on height
            if (height > 10000) {
                step = 1000;
            } else {
                step = 500;
            }*/

            // Find the nearest data points around the current height
            const upperBoundIndex = data.findIndex(d => d.height <= height);
            if (upperBoundIndex === -1) {
                // All points are above the height; unlikely, given the logic
                result.push({ ...data[data.length - 1], height });
            } else if (upperBoundIndex === 0 || data[upperBoundIndex].height === height) {
                // The exact match or the first element matches as the lowest point
                result.push({ ...data[upperBoundIndex], height });
            } else {
                // Normal case, interpolate between the bounds
                const upper = data[upperBoundIndex];
                const lower = data[upperBoundIndex - 1];

                const currentLayer = this.interpolate(lower, upper, height, previousHuman);
                previousHuman = currentLayer.human;
                result.push(currentLayer);
            }
        }

        console.log('Versuch: ' +  Utility.findOutTemperatureUnit(273)); //Kelvin in raw data
        console.log('Versuch: ' +  Utility.findOutWindUnit(10)); // m/s in raw data
        console.log('Versuch: ' +  Utility.findOutAltitudeUnit(100)); // m in raw data

        return result;
    }

    /**
     * Converts the raw data, sorted by pressure, into interpolated data layered by flight levels.
     * The interpolation is done for every 1000 feet, starting from the highest point down to the lowest.
     *
     * @param {Sounding[]} data - The array of sounding data objects, each containing height and other meteorological data.
     * @returns {Sounding[]} - The array of stratified data objects, each representing an interpolated flight level.
     */
    private interpolate(lower: Sounding, upper: Sounding, targetHeight: number, previousHuman: string): Sounding {
        const ratio = (targetHeight - upper.height) / (lower.height - upper.height);

        const pressure = Utility.linearInterpolation(upper.pressure, lower.pressure, ratio);

        const humidityWater = Utility.linearInterpolation(
            upper.humidityWater,
            lower.humidityWater,
            ratio,
        );

        const heightAGL = Utility.linearInterpolation(
            upper.heightAGL,
            lower.heightAGL,
            ratio,
        );

        const temperature = Utility.linearInterpolation(
            upper.temperature,
            lower.temperature,
            ratio,
        );

        const dewPointt = Utility.linearInterpolation(
            upper.dewPointt,
            lower.dewPointt,
            ratio,
        );

        /* const wind_u = Utility.linearInterpolation(
             upper.wind_u,
             lower.wind_u,
             ratio,
         );*/

        const wind_u = Utility.gaussianInterpolation(
            upper.wind_u,
            lower.wind_u,
            upper.height,
            lower.height,
            targetHeight,
        );

        /* const wind_v = Utility.linearInterpolation(
            upper.wind_v,
            lower.wind_v,
            ratio,
        ); */

        const wind_v = Utility.gaussianInterpolation(
            upper.wind_v,
            lower.wind_v,
            upper.height,
            lower.height,
            targetHeight,
        );

        /** calculate wind direction and wind speed from u and v component, to obtain correct 
         * interpolated values (as wind is a vector)
         */
        const windDir = Math.round(Utility.windDirection(wind_u, wind_v));
        const windSp = Math.round(Utility.windSpeed(wind_u, wind_v));


        const interpolated: Sounding = {
            height: targetHeight,
            heightAGL: heightAGL,
            pressure: pressure,
            temperature: temperature,
            humidityWater: humidityWater,
            wind_u: wind_u,
            wind_v: wind_v,
            windDir: windDir,
            windSp: windSp,
            dewPointt: dewPointt,
            human: previousHuman,
        };

        return interpolated;
    }

    private units(){
        
    }
}
