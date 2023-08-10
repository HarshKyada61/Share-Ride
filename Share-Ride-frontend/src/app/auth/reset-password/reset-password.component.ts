import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  isexpired = false;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService.CheckLink(params['token']).subscribe({
        next: (res: any) => {
          this.isexpired = !res.message;
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  ResetPassword(form: NgForm) {
    this.route.params.subscribe((params) => {
      this.userService
        .resetPassword(form.value.Password, params['token'])
        .subscribe({
          next: (res) => {
            this.router.navigate(['/auth']);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
  }
}
