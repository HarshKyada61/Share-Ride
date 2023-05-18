import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";

@Injectable({
    providedIn: 'root',
})
export class RideService{
    URL = environment.URL;
  setHeaders(token: any) {
    return {
      headers: { Authorization: token },
    };
  }

    constructor(private http: HttpClient) {}

    offerRide(Ride:any){
        const options = this.setHeaders(localStorage.getItem('token'));
        return this.http.post(this.URL + '/MakeRide', Ride, options);
    }

    takeRide(Ride:any){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.post(this.URL + '/TakeRide', Ride, options);
    }

    getCurrentRide(){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.get(this.URL + '/currentRide', options);
    }

    alltakenrides(){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.get(this.URL + '/GetRide', options);
    }

    allofferedRides(){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.get(this.URL + '/offeredRides', options);
    }

    findRide(Route:any){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.post(this.URL + '/FindRide', {Route}, options);
    }

    updateOfferedRide(updates:any, rideId:any){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.patch(this.URL + '/updateOfferedRide/'+rideId, updates, options);
    }

    updateTakenRide(updates:any, rideId:any){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.patch(this.URL + '/updateTakenRide/'+rideId, updates, options);
    }

    rideTotake(rideId:string){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.get(this.URL + '/findRideByID/'+rideId, options);
    }

    ridesToPickup(rideId:string){
      const options = this.setHeaders(localStorage.getItem('token'));
      return this.http.get(this.URL + '/ridesToPickup/'+rideId, options);
    }
}