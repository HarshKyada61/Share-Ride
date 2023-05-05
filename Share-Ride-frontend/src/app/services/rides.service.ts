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

    createRide(Ride:any){
        const options = this.setHeaders(localStorage.getItem('token'));
        return this.http.post(this.URL + '/MakeRide', Ride, options);
    }
}