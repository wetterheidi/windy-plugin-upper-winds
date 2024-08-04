let ddd: number = 0;
let ff: number = 0;

// wind speed calculated from wind_u and wind_v component
function windSpeed( uComponent: number , vComponent: number ){
ff = Math.sqrt(uComponent ** 2 + vComponent ** 2);
return ff;

}

// wind direction calculated from wind_u and wind_v component
function windDirection( uComponent: number ,vComponent: number){
    ff = Math.sqrt(uComponent ** 2 + vComponent ** 2);
if (vComponent >= 0 && uComponent > 0) {
    ddd = 90 - (Math.acos(uComponent / ff) * 180) / Math.PI;
} else if (vComponent >= 0 && uComponent < 0) {
    ddd = 90 - (Math.acos(uComponent / ff) * 180) / Math.PI + 360;
} else if (vComponent < 0) {
    ddd = 90 + (Math.acos(uComponent / ff) * 180) / Math.PI;
}
ddd = (ddd + 180) % 360;
return ddd;
}
/* Testing
let u : number = 5;
let v : number = -5;
windSpeed(u,v);
console.log('Geschwindigkeit: ' + ff);
windDirection(u,v);
console.log('Richtung: ' + ddd);
Testing finished*/