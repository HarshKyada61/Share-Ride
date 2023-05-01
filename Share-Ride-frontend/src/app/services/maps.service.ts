import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private http: HttpClient) {}
  AccessKey = environment.MapboxKey

  searchPlace(address: any) {
    return this.http
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
          encodeURIComponent(address) +
          `.json?access_token=`+this.AccessKey
      )
      .pipe(map((res: any) => res.features));
  }

  searchPlaceWithLatLon(lng:string, lat:string) {
    return this.http
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/+` +
          lng +
          `,` +
          lat +
          `.json?access_token=`+this.AccessKey
      )
      .pipe(
        map((res: any) => {
          let arr = res.features;
           arr = arr.filter((obj:{place_type:string[]}) => obj.place_type[0] === 'locality' || obj.place_type[0]==='neighborhood')
          return arr[0].place_name;
        })
      );
  }

  searchRoute(slng:number,slat:number,elng:number,elat:number){
    return this.http.get(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic	/${slng},${slat};${elng},${elat}?alternatives=true&annotations=distance&overview=full&geometries=geojson&access_token=`+this.AccessKey)
  }
}
