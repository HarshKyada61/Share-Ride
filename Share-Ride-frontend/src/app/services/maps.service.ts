import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private http: HttpClient) {}

  searchPlace(address: any) {
    return this.http
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
          encodeURIComponent(address) +
          `.json?access_token=pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ`
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
          `.json?access_token=pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ`
      )
      .pipe(
        map((res: any) => {
          let arr = res.features;
           arr = arr.filter((obj:{place_type:string[]}) => obj.place_type[0] === 'locality' || obj.place_type[0]==='neighborhood')
          return arr[0].place_name;
        })
      );
  }
}
