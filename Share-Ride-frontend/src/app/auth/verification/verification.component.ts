import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private UserService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  verify() {
    this.route.params.subscribe((params) => {
      this.UserService.verify(params['token']).subscribe({
        next:(res: any) => {
          localStorage.setItem('token', 'Bearer ' + res.tokenid);
          this.UserService.isAuthenticated.next(true);
          this.router.navigate(['/profile/new']);
        },
        error:(err) => {
          if (err.status === 400) {
            alert(err.error);
          } else {
            console.log(err);
            
          }
        }}
      );
    });
  }
}
