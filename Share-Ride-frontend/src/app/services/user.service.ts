import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isAuthenticated=new  BehaviorSubject<boolean>(false);

  URL = "http://localhost:3000/Share-Ride";
  setHeaders(token:any){
    return {
        headers: {'Authorization': token}
    }
}

  constructor(private http: HttpClient) { }

  //signup API call
  signup(user:any){
    return this.http.post(this.URL+'/Signup', user)
  }

  //Login API call
  login(user:any){
    return this.http.post(this.URL+'/Login', user)
                    // .pipe(
                    //   catchError()
                    // )
  }

  //Logout API call
  logout(){
    const options = this.setHeaders(localStorage.getItem('token')) 
    return this.http.post(this.URL+'/Logout',{},options)
  }

  //get User Details
  getUser(){
    const options = this.setHeaders(localStorage.getItem('token')) 
    return this.http.get(this.URL+"/Profile", options)
  }

  //delete User
  deleteUser(){
    const options = this.setHeaders(localStorage.getItem('token'))
    return this.http.delete(this.URL+"/DeleteUser",options)
  }

}
