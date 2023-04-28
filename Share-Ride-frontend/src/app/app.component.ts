import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Event, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Share-Ride-frontend';
  isAuthRoute=false;

  constructor(public userservice: UserService,private router: Router){}

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.userservice.isAuthenticated.next(true);
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
          if(event.url === '/auth' || event.url.includes('/verify')){
            this.isAuthRoute = true;
          }
          else{
            this.isAuthRoute = false
          }
      }
  });
      
   
  }
}
