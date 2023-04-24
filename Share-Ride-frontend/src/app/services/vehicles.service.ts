import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class VehiclesService{
    URL = "http://localhost:3000/Share-Ride"

    setHeaders(token:any){
        return {
            headers: {'Authorization': token}
        }
    }

    constructor(private http: HttpClient) {}
    
    //get vehicles
    getVehicles(){
        const options = this.setHeaders(localStorage.getItem('token')) 
        return this.http.get(this.URL+'/Vehicles',options)
    }

    //Add Vehicle
    addVehicle(vehicle:any){
        const options = this.setHeaders(localStorage.getItem('token')) 
        return this.http.post(this.URL+'/Add-Vehicle',vehicle,options)
    }

}