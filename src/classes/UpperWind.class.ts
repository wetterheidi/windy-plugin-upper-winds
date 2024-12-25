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
    public _step = 0;
    /** Reference level for altitude */
    public _reference = 'AGL';
    /** Lower level for mean wind calculation */
    public _lowerLevel: string = '0';
    /** Upper level for mean wind calculation */
    public _upperLevel: string = '3000';
    /** In case of times later than available, this is set to true to avoid wrong time/data tables */
    public _errorhandler: boolean = false;

    setTime(t: number) {
        this._timestamp = t;
    }

    get getTime() {
        return this._timestamp;
    }

    get lowerLevel() {
        return this._lowerLevel;
    }

    get upperLevel() {
        return this._upperLevel;
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
        return date.toString();
    }

    get errorhandler() {
        return this._errorhandler;
    }
    get model() {
        return this._model;
    }

    get reference() {
        return this._reference;
    }

    restratify() {
        if (this._rawdata.length) {
            this._flightLevels = this.stratify(this._rawdata);
            return this._flightLevels;
        }
        return undefined;
    }

    /** Handle the click event (The request for the upper wind analysis) */
    async handleEvent(ev: { lat: any; lon: any }) {
        try {
            const product = await store.get('product'); // Retrieve product (forecast model) asynchronously
            const locationObject = await reverseName.get({ lat: ev.lat, lon: ev.lon }); // Retrieve the location data
            this._clickLocation = Utility.locationDetails(locationObject); // Convert to human readable
            const weatherData = await this.fetchData(ev.lat, ev.lon, product); // Retrieve the sounding from location
            //this._elevation = await Utility.getElevation(ev.lat, ev.lon); // Get elevation data from API
            //this._step = 500; // set height increment to interpolate
            this.findNearestColumn(weatherData.data.data.hours);
            this._forecastDate = weatherData.data.data.hours[this._forecastColumn];
            this._model = weatherData.data.header.model;
            this.updateWeatherStats(weatherData.data); // Interpret the data
            this._errorhandler = false; 
        } catch (error) {
            console.error('* * * An error occurred:', error);
            this._errorhandler = true;
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
        const timediff = this._timestamp - Date.now();
        console.log('Timestamp' + timediff);
        /** Check if user has a premium account and timestep 1 hour is available*/
        if (store.get('subscription') === 'premium' && timediff < 400000000) {
            return windyFetch.getMeteogramForecastData(product, { lat, lon, step: 1, extended: true });
        } else {
            return windyFetch.getMeteogramForecastData(product, { lat, lon, extended: true });
        }
    }

    /**
     * Processes the weather data retrieved from the API, calculates additional columns,
     * and stratifies the data for further use.
     * 
     * @param {MeteogramDataPayload} weatherData - The weather data payload retrieved from the API.
     */
    private updateWeatherStats = (weatherData: MeteogramDataPayload) => {
        this._rawdata = []; // Array to store data for each layer
        this._elevation = weatherData.header.elevation; //Pick elevation from windy API
        // console.log('_____________' , JSON.stringify(weatherData.header)); //Code to find out the structure of weatherData.header

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
                const height = +(metrics.altitude.convertNumber((weatherData.data[key as keyof MeteogramDataHash][this._forecastColumn]), 2)); //Convert model output to User settings
                const heightAGL = +(metrics.altitude.convertNumber((heightInMeters - this.elevation).toFixed(this._forecastColumn), 2)); // Convert to AGL
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
        let startHeight: number = 0;
        let endHeight: number = 0;

        // Determine factor for height conversion depending on user settings
        let mInFtFactor: number = 1;
        if (Utility.findOutAltitudeUnit(1000) == 'ft') {
            mInFtFactor = 3.28084;
        } else if (Utility.findOutAltitudeUnit(1000) == 'm') {
            mInFtFactor = 1;
        }
        // Define the range of heights for interpolation
        if (this.reference == 'AGL') {
            // Define start height so that AGL is rounded according to the "step"
            startHeight = (Math.floor((data[0].height - this.elevation * mInFtFactor) / this.step) * this.step + (this.elevation * mInFtFactor)); // Highest point (AMSL)
            // Lowest point above ground level, rounded down to nearest "half step", substract "half step" to find ground level
            endHeight = Math.ceil((data[data.length - 1].height + this.elevation * mInFtFactor) / (this.step / 2)) * (this.step / 2) - (this.step / 2);
            //console.log('end height referring to AMSL: ' + endHeight + ' Elevation: ' + this.elevation * mInFtFactor);
            if (endHeight < 0) {
                endHeight = 0;
            }
        } else if (this.reference == 'AMSL') {
            startHeight = Math.floor(data[0].height / this.step) * this.step; // Highest point (AMSL)
            // Lowest point above ground level, rounded down to nearest "half step", substract "half step" to find ground level
            endHeight = Math.ceil((data[data.length - 1].height + this.elevation * mInFtFactor) / (this.step)) * (this.step);
            if (endHeight < 0) {
                endHeight = 0;
            }
        }
        // Avoiding NaN in pressure values greater then 1000 hPa
        if (isNaN(data[data.length - 1].pressure)) {
            //data[data.length - 1].pressure = data[data.length - 2].pressure + (data[data.length - 2].height / 32);
            data[data.length - 1].pressure = Utility.calculatePressure((data[data.length - 2].pressure), (data[data.length - 2].height));
            //console.log('calculated pressure: ' + data[data.length - 1].pressure);
        } else if (isNaN(data[data.length - 2].pressure)) {
            data[data.length - 2].pressure = Utility.calculatePressure((data[data.length - 3].pressure), (data[data.length - 3].height));
            //console.log('calculated pressure: ' + data[data.length - 2].pressure);
        }

        let previousHuman = '';
        for (let height = startHeight; height >= endHeight; height -= this.step) {

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

        const heightAGL = Math.round(Utility.linearInterpolation(
            upper.heightAGL,
            lower.heightAGL,
            ratio,
        ) / 10) * 10; //Round to 10 to avoid rounding errors

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

}
