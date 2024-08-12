import { LocationDetails } from './Locationdetails.interface';

export class Utility {
  static linearInterpolation(y1: number, y2: number, ratio: number): number {
    return Math.round(y1 + (y2 - y1) * ratio);
  }

  static locationDetails(locationObject: LocationDetails): string {
    console.log("locationObject:", locationObject)
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
    ff = Math.sqrt(uComponent ** 2 + vComponent ** 2);
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
    ddd = Math.round(ddd / 10); //To round to hole tens. "0" is added in plugin.svelte html-Part
    if (ddd == 0) {
      ddd = 36;
    }
    return ddd;
  }

  static getElevation(lat: number, lon: number): number {
    /** Pick up elevation data */
    //elevPntFcst = wxdata.data.header.elevation;
    let elev: number = 12345;
    let elevRaw: number;
    console.log('An getElevation übergebene Position: ' + lat + lon);
    fetch(`https://www.flymap.co.za/srtm30/elev.php?lat=${lat}&lng=${lon}`, {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        elevRaw = r[0];
        console.log('Raw: ' + elevRaw);
        //setTimeout(() => (elevfnd = true), 100);
        elev = Math.round(elevRaw * 3.28084);
        console.log('Feet: ' + elev);
        if (elev < 0) {
          console.log('in der if schleife, die die elevation auf 0 setzt');
          elev = 0;
        }
      })
      .catch(er => {
        console.log(er);
      });
      setTimeout(() => (console.log('Das wird returned: ' + elev)), 1000);
    //console.log('Das wird returned: ' + elev);
    return elev;
  }
}



