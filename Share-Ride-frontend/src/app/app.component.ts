import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Share-Ride-frontend';

  constructor(public userservice: UserService){}

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.userservice.isAuthenticated.next(true);
    }
  }
}
