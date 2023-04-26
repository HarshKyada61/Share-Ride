import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router){}

  ResetPassword(form:NgForm){

    this.route.params.subscribe((params) => {
      this.userService.resetPassword(form.value.Password,params['token']).subscribe({next:(res)=> {
        this.router.navigate(['/auth'])
      },error:(err)=>{
        console.log(err);
      }})
    })
  }
}
