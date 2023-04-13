import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isError= false;

  isLoading=false;

  constructor(public auth: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    event?.preventDefault();
    this.isLoading = true

    if (!this.isLoginMode) {
      this.auth.signup(form.value).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);
          this.isLoading=false
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
      this.auth.login(form.value).subscribe(
        (res: any) => {
          localStorage.setItem('token',res.token);
          this.isLoading=false
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
          this.isLoading=false
  }
}
