import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  URL = "http://localhost:3000/Share-Ride"
  setHeaders(token:any){
    return {
        headers: {'Authorization': token}
    }
}

  constructor(private http: HttpClient) { }

  //get User Details
  getUser(){
    const options = this.setHeaders(localStorage.getItem('token')) 
    return this.http.get(this.URL+"/Profile", options)
  }

}
