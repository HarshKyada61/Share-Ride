import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAurhenticated=new  BehaviorSubject<boolean>(false);

  URL = "http://localhost:3000/Share-Ride"

  constructor(private http: HttpClient) { }

  //signup API call
  signup(user:any){
    return this.http.post(this.URL+'/Signup', user)
  }

  //Login API call
  login(user:any){
    return this.http.post(this.URL+'/Login', user)
  }

}
