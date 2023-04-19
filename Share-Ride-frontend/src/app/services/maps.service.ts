import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class MapsService{
    constructor(private http: HttpClient) { }

    searchPlace(address:any){
        return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/`+ encodeURIComponent(address) +`.json?access_token=pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ`)
                        .pipe(map((res:any) => (res.features)))
    }

    searchPlaceWithLatLon(lanLat:any){
      return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/+`+lanLat.lng+`,`+lanLat.lat+`.json?access_token=pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ`)

    }
} 