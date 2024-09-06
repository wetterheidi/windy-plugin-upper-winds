import windyStore from '@windy/store';
import metrics from '@windy/metrics';
import { LocationDetails } from './Locationdetails.interface';


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
    ddd = Math.round(ddd / 10) * 10; //To round to hole tens. 
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
    return unitALtitude;
  }

  static LIP(xVector: number[], yVector: number[], xValue: number): number | string {
    // interpolate using a vector array
    let Dimension: number = 0;
    let m: number = 0;
    let n: number = 0;
    let i: number = 0;
    let reversed: boolean = false;

    if (xVector[1] > xVector[0]) {
      yVector.reverse();
      xVector.reverse();
      reversed = true;
    }

    Dimension = xVector.length - 1;
    try {
      if (xValue > xVector[0] || xValue < xVector[Dimension]) {
        if (xValue > xVector[0]) {
          m = (yVector[1] - yVector[0]) / (xVector[1] - xVector[0]);
          n = yVector[1] - m * xVector[1];
        } else {
          m = (yVector[Dimension] - yVector[Dimension - 1]) / (xVector[Dimension] - xVector[Dimension - 1]);
          n = yVector[Dimension] - m * xVector[Dimension];
        }
        return m * xValue + n;
      } else {
        for (i = 1; i <= Dimension; i++) {
          if (xValue >= xVector[i]) { break; }
        }

        m = (yVector[i] - yVector[i - 1]) / (xVector[i] - xVector[i - 1]);
        n = yVector[i] - m * xVector[i];
        return m * xValue + n;
      }
    } catch (error) {
      return "interpolation error";
    } finally {
      if (reversed) {
        yVector.reverse();
        xVector.reverse();
      }
    }
  }

  static Mittelwind(Höhe: number[], xKomponente: number[], yKomponente: number[], Untergrenze: number, Obergrenze: number): number[] {
    //calculate mean winds using trapezoid formula

    const dddff: number[] = new Array(4);

    //const xObergrenze: number, yObergrenze: number, xUntergrenze: number, yUntergrenze: number;
    let h: number, x: number, y: number;
    const hSchicht: number[] = [Obergrenze];

    // Interpolate values at the upper and lower limits of the layer
    const xObergrenze: number = Number(Utility.LIP(Höhe, xKomponente, Obergrenze));
    const yObergrenze: number = Number(Utility.LIP(Höhe, yKomponente, Obergrenze));
    const xUntergrenze: number = Number(Utility.LIP(Höhe, xKomponente, Untergrenze));
    const yUntergrenze: number = Number(Utility.LIP(Höhe, yKomponente, Untergrenze));

    const xSchicht: number[] = [xObergrenze];
    const ySchicht: number[] = [yObergrenze];

    for (let i = 0; i < Höhe.length; i++) {
      if (Höhe[i] < Obergrenze && Höhe[i] > Untergrenze) {
        h = Höhe[i];
        x = xKomponente[i];
        y = yKomponente[i];

        hSchicht.push(h);
        xSchicht.push(x);
        ySchicht.push(y);
      }
    }

    hSchicht.push(Untergrenze);
    xSchicht.push(xUntergrenze);
    ySchicht.push(yUntergrenze);

    // Calculate average x and y components
    let xTrapez: number = 0;
    let yTrapez: number = 0;

    for (let i = 0; i < hSchicht.length - 1; i++) {
      xTrapez += 0.5 * (xSchicht[i] + xSchicht[i + 1]) * (hSchicht[i] - hSchicht[i + 1]);
      yTrapez += 0.5 * (ySchicht[i] + ySchicht[i + 1]) * (hSchicht[i] - hSchicht[i + 1]);
    }
    const xMittel: number = xTrapez / (hSchicht[0] - hSchicht[hSchicht.length - 1]);
    const yMittel: number = yTrapez / (hSchicht[0] - hSchicht[hSchicht.length - 1]);

    dddff[2] = xMittel;
    dddff[3] = yMittel;

    // Determine average wind direction and speed in the layer
    dddff[1] = Utility.windSpeed(xMittel, yMittel);

    dddff[0] = Utility.windDirection(xMittel, yMittel);

    //dddff(0) Mittelwindrichtung
    //dddff(1) Mittelwindgeschwindigkeit
    //dddff(2) = xMittel
    //dddff(3) = yMittel

    return dddff;
  }

  static checkOverlay() {
    /* Check overlay and change to wind overlay if nowcasting overlays are preset*/

    const overlay: string = windyStore.get('overlay');
    if (overlay == 'satellite' || overlay == 'radar' || overlay == 'radar-plus') {
      alert('Windy overlay is automatically set to wind \n as ' + overlay + ' layer is not a model overlay.');
      windyStore.set('overlay', 'wind');
    }


  }
}