import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = false;
  isError= false;

  isLoading=false;

  constructor(public userService: UserService, public router:Router) {}

  checkValue(values: any){
    this.isLoginMode = values.currentTarget.checked
 }
 

  onSubmit(form: NgForm) {
    event?.preventDefault();
    this.isLoading = true

    if (!this.isLoginMode) {
      this.userService.signup(form.value).subscribe(
        (res: any) => {
          this.onSuccess(res.token)
          this.router.navigate(['/profile'])
        },
        (err) => {
          if(err.error){
            alert(err.error);
          }
          else{
            alert("An Error Ocuured")
          }
          this.isLoading=false
        }
      );
    } else {
      this.userService.login(form.value).subscribe(
        (res: any) => {
          this.onSuccess(res.token);
          this.router.navigate(['/profile'])
        },
        (err) => {
          if(err.error){
            alert(err.error);
          }
          else{
            alert("An Error Ocuured")
          }
          this.isLoading=false
        }
      );
    }
  }

  onSuccess(token:string){
    localStorage.setItem('token','Bearer '+token);
    this.userService.isAuthenticated.next(true)
    this.isLoading=false
  }
}
