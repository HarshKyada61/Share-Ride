import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription, catchError, delay, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isAuthenticated = new BehaviorSubject<boolean>(false);
  timeout = 86400;
  tokenSubscription: Subscription | undefined;

  URL = 'http://localhost:3000/Share-Ride';
  setHeaders(token: any) {
    return {
      headers: { Authorization: token },
    };
  }

  constructor(private http: HttpClient, private router: Router) {}

  //signup API call
  signup(user: any) {
    return this.http.post(this.URL + '/Signup', user);
  }

  //verify Email
  verify(token: any) {
    return this.http.get(this.URL + '/verify/' + token);
  }

  //Login API call
  login(user: any) {
    return this.http.post(this.URL + '/Login', user);
  }

  //Logout API call
  logout() {
    const options = this.setHeaders(localStorage.getItem('token'));
    this.isAuthenticated.next(false);
    localStorage.removeItem('token');
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
    return this.http.post(this.URL + '/Logout', {}, options);
  }

  //get User Details
  getUser() {
    const options = this.setHeaders(localStorage.getItem('token'));
    return this.http.get(this.URL + '/Profile', options);
  }

  //update User Details
  updateUser(updates: any) {
    const options = this.setHeaders(localStorage.getItem('token'));
    return this.http.patch(this.URL + '/Profile/Update', updates, options);
  }

  //delete User
  deleteUser() {
    const options = this.setHeaders(localStorage.getItem('token'));
    return this.http.delete(this.URL + '/DeleteUser', options);
  }

  //send reset mail
  sendResetMail(email:string){
    return this.http.post(this.URL+'/PasswordMail',{email})
  }

  //Reset Password
  resetPassword(password:string,token:string){
    return this.http.patch(this.URL+'/ResetPassword/'+token,{password})
  }

  setToken(token: any) {
    this.isAuthenticated.next(true);
    localStorage.setItem('token', 'Bearer ' + token);
    this.setTokenExpiration(this.timeout);
  }

  setTokenExpiration(timeout: any) {
    this.tokenSubscription = of(null)
      .pipe(delay(timeout * 1000))
      .subscribe((res) => {
        console.log('token expired');
        this.logout().subscribe(() => this.router.navigate(['/auth']));
      });
  }

  
}
