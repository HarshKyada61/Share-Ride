import { Injectable } from "@angular/core";
import { LngLatLike } from "mapbox-gl";

@Injectable({
    providedIn: 'root',
})

export class HomeService{
    Distance: number | undefined;
    Duration: string | undefined;
    cost: number | undefined;
    vehicles:{VehicleNo:string, _id:string, Type:string}[] = []

    srcLocation:
    | {
        cords: LngLatLike;
        place_name: string;
      }
    | undefined;

  destLocation:
    | {
        cords: LngLatLike;
        place_name: string;
      }
    | undefined;
  route: Number[][] | undefined;

  matchedRides:any

  searchingRide = false
  
} 