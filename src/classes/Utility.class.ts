import { LocationDetails } from './Locationdetails.interface';
import metrics from '@windy/metrics';


export class Utility {

  static linearInterpolation(y1: number, y2: number, ratio: number): number {
    return Math.round(y1 + (y2 - y1) * ratio);
  }

  static gaussianInterpolation(y1: number, y2: number, h1: number, h2: number, hp: number): number {
    /** Using a weighted interpolation with simplified truncated gaussian filters according to
     * https://www.e3s-conferences.org/articles/e3sconf/pdf/2024/06/e3sconf_aisce2023_01057.pdf
     * y1, h1: values at the upper data point
     * y2, h2: values at the lower data point
     * hp: target height 
     */
    let w1: number = 0;
    let w2: number = 0;

    w1 = 1 / Math.abs(h1 - hp);
    w2 = 1 / Math.abs(h2 - hp);

    const yp: number = (w1 * y1 + w2 * y2) / (w1 + w2);
    return yp;
  }

  static locationDetails(locationObject: LocationDetails): string {
    console.log("locationObject:", locationObject);
    // Destructure the needed properties from the object
    const { name, region, lat, lon, nameValid } = locationObject;

    // Check if name and region are the same, checking if the nameValid property is set   
    const nameRegion = nameValid ? name === region ? name : `${name} : ${region}` : '';

    // Format latitude and longitude to two decimal places
    const formattedLat = lat.toFixed(2);
    const formattedLon = lon.toFixed(2);

    // Concatenate the final string
    return `${nameRegion} (${formattedLat}, ${formattedLon})`;
  }

  static windSpeed(uComponent: number, vComponent: number): number {
    // wind speed calculated from wind_u and wind_v component
    let ff: number = 0;
    ff = metrics.wind.convertNumber(Math.sqrt(uComponent ** 2 + vComponent ** 2)); // Convert windspeed from m/s raw data to User settings
    return ff;
  }


  static windDirection(uComponent: number, vComponent: number): number {
    // wind direction calculated from wind_u and wind_v component
    let ddd: number = 0;
    let ff: number = 0;
    //First calculate Speed
    ff = Math.sqrt(uComponent ** 2 + vComponent ** 2);
    //Then calculate Direction
    if (vComponent >= 0 && uComponent > 0) {
      ddd = 90 - (Math.acos(uComponent / ff) * 180) / Math.PI;
    } else if (vComponent >= 0 && uComponent < 0) {
      ddd = 90 - (Math.acos(uComponent / ff) * 180) / Math.PI + 360;
    } else if (vComponent < 0) {
      ddd = 90 + (Math.acos(uComponent / ff) * 180) / Math.PI;
    }
    ddd = (ddd + 180) % 360;
    //console.log('Windrichtung ungerundet: ' + ddd);
    ddd = Math.round(ddd / 10) * 10; //To round to hole tens. 
    //console.log('Windrichtung gerundet: ' + ddd);
    if (ddd == 0) {
      ddd = 360;
    }
    return ddd;
  }

  static async getElevation(lat: number, lon: number): Promise<number> {
    // Fetch terrain elevation according to 
    //https://chatgpt.com/share/141edd4b-8987-444f-8cb8-e7f5cbb0f001
    const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
    const data = await response.json();
    return data.results[0].elevation;
  }

  static calculatePressure(p: number, h: number): number {
    // reduce the pressure down to sea level rounded to hole hPa values
    let qnh: number = 0;
    const a: number = 287.05 * (0.0065 / 9.80665);
    const b: number = 0.0065 * (Math.pow(1013.25, a) / 288.15);

    qnh = Math.round(Math.pow((Math.pow(p, a) + b * (h / 3.28084)), (1 / a)));

    return qnh;
  }

  static findOutTemperatureUnit(temperature: number): string {
    // find out the unit from user settings
    let unitTemperature: string = '';
    const temperatureString: string = metrics.temp.convertValue(temperature);
    if (temperatureString.match('°C')) {
      unitTemperature = '°C';
    } else if (temperatureString.match('°F')) {
      unitTemperature = '°F';
    }
    console.log('Umgewandelte temperatur ' + temperatureString);
    console.log('------> Temperatureinheit rausgefischt?: ' + unitTemperature);
    return unitTemperature;
  }

  static findOutWindUnit(wind: number): string {
    // find out the unit from user settings
    let unitWind: string = '';
    const windString: string = metrics.wind.convertValue(wind);
    if (windString.match('kt')) {
      unitWind = 'kt';
    } else if (windString.match('bft')) {
      unitWind = 'bft';
    } else if (windString.match('m/s')) {
      unitWind = 'm/s';
    } else if (windString.match('km/h')) {
      unitWind = 'km/h';
    } else if (windString.match('mph')) {
      unitWind = 'mph';
    }
    console.log('Umgewandelte Wind ' + windString);
    console.log('------> Windeinheit rausgefischt?: ' + unitWind);
    return unitWind;
  }

  static findOutAltitudeUnit(altitude: number): string {
    // find out the unit from user settings
    let unitALtitude: string = '';
    const altitudeString: string = metrics.altitude.convertValue(altitude);
    if (altitudeString.match('m')) {
      unitALtitude = 'm';
    } else if (altitudeString.match('ft')) {
      unitALtitude = 'ft';
    }
    console.log('Umgewandelte Höhe ' + altitudeString);
    console.log('------> Höheneinheit rausgefischt?: ' + unitALtitude);
    return unitALtitude;
  }
}