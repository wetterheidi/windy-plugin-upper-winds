import store from '@windy/store';
import reverseName from '@windy/reverseName';
import windyFetch from '@windy/fetch';
import {
    MeteogramDataPayload,
    MeteogramDataHash,
} from '@windycom/plugin-devtools/types/interfaces';
import { Sounding } from './Sounding.interface';
import { Utility } from './Utility.class';


export class Contrail {

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

    get model() {
        return this._model;
    }

    /** Handle the click event (The request for the contrail analysis) */
    async handleEvent(ev: { lat: any; lon: any; }) {
        try {
            const product = await store.get('product'); // Retrieve product (forecast model) asynchronously
            const locationObject = await reverseName.get({ lat: ev.lat, lon: ev.lon }); // Retrieve the location data
            this._clickLocation = Utility.locationDetails(locationObject); // Convert to human readable
            const weatherData = await this.fetchData(ev.lat, ev.lon, product); // Retrieve the sounding from location
            this.findNearestColumn(weatherData.data.data.hours);
            this._forecastDate = weatherData.data.data.hours[this._forecastColumn];
            this._model = weatherData.data.header.model;
            this.updateWeatherStats(weatherData.data); // Interpret the data
        } catch (error) {
            console.error('* * * An error occurred:', error);
        }
    }

  private  findNearestColumn(epoch: number[]) {

        // Get the current time in Unix epoch format
        const currentTime = Date.now();
        
        let closestIndex = -1;
        let closestDiff = Infinity;

        // Iterate through the hours array to find the closest timestamp
        for (let i = 0; i < epoch.length; i++) {
            const diff = Math.abs(epoch[i] - currentTime);
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
                const windKey = `wind-${suffix}`;

                const pressure = +suffix.slice(0, -1);
                const heightInMeters = +weatherData.data[key as keyof MeteogramDataHash][this._forecastColumn];
                const height = +(heightInMeters * 3.28084).toFixed(this._forecastColumn); // Convert to feet
                //hier wind mit einbauen
                const windDirection = +(weatherData.data[tempKey as keyof MeteogramDataHash][this._forecastColumn]- 273.15).toFixed(0); 
                const windSpeed = +(weatherData.data[tempKey as keyof MeteogramDataHash][this._forecastColumn]- 273.15).toFixed(0); 
                 //hier wind mit einbauen
                const temperature = +(weatherData.data[tempKey as keyof MeteogramDataHash][this._forecastColumn] - 273.15).toFixed(0); // Convert Kelvin to Celsius
                const humidityWater =+weatherData.data[humidityKey as keyof MeteogramDataHash][this._forecastColumn].toFixed(0);
                const dewPointt = +(weatherData.data[tempKey as keyof MeteogramDataHash][this._forecastColumn] - 273.15).toFixed(0);
                
               

                this._rawdata.push({
                    pressure,
                    height,
                    temperature,
                    humidityWater,
                    windDirection,
                    windSpeed,
                    dewPointt,
                });
            
            }
        }
        // Sorting the array by height in descending order
        this._rawdata.sort((a, b) => b.height - a.height);

        console.log('Processed Layers Data:', this._rawdata);
        this._flightLevels = this.stratify(this._rawdata);
        console.log('Stratified Data:', this.flightLevels);
    };


    stratify(data: Sounding[]) {
        const result = [];
        // Define the range of heights for interpolation
        const startHeight = Math.floor(data[0].height / 1000) * 1000; // Highest point, rounded down to nearest 1000
        let endHeight = Math.floor(data[data.length - 1].height / 1000) * 1000; // Lowest point, rounded down to nearest 1000
        const step = 1000;

        if (endHeight < 0) {
            endHeight = 0;
        }

        let previousHuman = '';
        for (let height = startHeight; height >= endHeight; height -= step) {
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

                const currentLayer = this.interpolate(lower, upper, height,previousHuman);
                previousHuman = currentLayer.human;
                result.push(currentLayer);
            }
        }

        return result;
    }

    /**
     * Converts the raw data, sorted by pressure, into interpolated data layered by flight levels.
     * The interpolation is done for every 1000 feet, starting from the highest point down to the lowest,
     * but not below 20000 feet.
     *
     * @param {Sounding[]} data - The array of sounding data objects, each containing height and other meteorological data.
     * @returns {Sounding[]} - The array of stratified data objects, each representing an interpolated flight level.
     */
    interpolate(lower: Sounding, upper: Sounding, targetHeight: number, previousHuman: string): Sounding {
        const ratio = (targetHeight - upper.height) / (lower.height - upper.height);

        const pressure = Utility.linearInterpolation(upper.pressure, lower.pressure, ratio);

        const humidityWater = Utility.linearInterpolation(
            upper.humidityWater,
            lower.humidityWater,
            ratio,
        );

        const temperature = Utility.linearInterpolation(
            upper.temperature,
            lower.temperature,
            ratio,
        );

        const interpolated: Sounding = {
            height: targetHeight,
            pressure: pressure,
            temperature: temperature,
            humidityWater: humidityWater,
            windDirection: temperature,
            windSpeed: temperature,
            Dewpointt: temperature,
        };

        return interpolated;
    }
}
