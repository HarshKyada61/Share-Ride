import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = false;
  error=false;
  isLoading=false;

  constructor(public userService: UserService, public router:Router, private toastr: ToastrService) {}

  checkValue(values: any){
    this.isLoginMode = values.currentTarget.checked
 }
 

  onSubmit(form: NgForm) {
    event?.preventDefault();
    this.isLoading = true

    if (!this.isLoginMode) {
      const user = {
        "Name": form.value.Name,
        "Email": form.value.Email,
        "MobileNo": form.value.MobileNo,
        "Password": form.value.Password,
      }
      this.userService.signup(user).subscribe(
        (res: any) => {
          this.isLoading=false;
          this.toastr.success("Verification Email has been sent to EmailId")
          // this.onSuccess(res.token)
          // this.router.navigate(['/profile/new'])
        },
        (err) => {
          if(err.status === 400){
            alert(err.error)  
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
          this.router.navigate(['/'])
        },
        (err) => {
          if(err.status === 400){
            this.error = true;
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

  showPassword(password:any){
    if(password.type==='password'){
      password.type = 'text'
    }
    else{
      password.type='password'
    }
  }

}
