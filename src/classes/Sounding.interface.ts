export interface Sounding {
    pressure: number;       // Pressure in hPa
    wind_u: number;         // Wind u component
    wind_v: number;         // Wind v component
    windDir: number;        // Wind direction
    windSp: number;         // Wind speed
    height: number;         // Height in feet
    temperature: number;    // Temperature in celsius
    humidityWater: number;  // Relative humidity with respect to water (RHw)
    dewPointt: number;      // Dewpoint temperature
    human: string;          // Human readable prediction
}