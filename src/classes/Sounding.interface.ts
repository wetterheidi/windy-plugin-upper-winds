export interface Sounding {
    pressure: number;       // Pressure in hPa
    wind_u: number;      // Wind speed
    wind_v: number;  // Wind direction
    height: number;         // Height in feet
    temperature: number;    // Temperature in celsius
    humidityWater: number;  // Relative humidity with respect to water (RHw)
    dewPointt: number;      // Dewpoint temperature
}