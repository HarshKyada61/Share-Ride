import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";

@Injectable({
    providedIn: 'root',
})

export class RequestsService {
    URL = environment.URL;
    setHeaders(token: any) {
      return {
        headers: { Authorization: token },
      };
    }

    constructor(private http: HttpClient) {}

    sendRequest(OwnRide:string, RequestedRide:string){
        const options = this.setHeaders(localStorage.getItem('token'));
        return this.http.post(this.URL + '/send_request', {OwnRide, RequestedRide}, options);
    }

    getRequests(rideId:string){
        const options = this.setHeaders(localStorage.getItem('token'));
        return this.http.get(this.URL + '/Show_Request/'+rideId, options);
    }

    updateRequest(update:any,request:string){
        const options = this.setHeaders(localStorage.getItem('token'));
        return this.http.patch(this.URL + '/update_Request/' + request,update, options);
    }

    sentRequests(rideId:string){
        const options = this.setHeaders(localStorage.getItem('token'));
        return this.http.get(this.URL + '/getRequest/'+rideId, options);
    }
}