export interface Sounding {
    pressure: number;       // Pressure in hPa
    windSpeed: number;      // Wind speed
    windDirection: number;  // Wind direction
    height: number;         // Height in feet
    temperature: number;    // Temperature in celsius
    humidityWater: number;  // Relative humidity with respect to water (RHw)
}