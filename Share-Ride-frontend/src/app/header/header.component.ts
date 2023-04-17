import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public router:Router,public userService: UserService){}

  logout(){

    this.userService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/auth'])
    })
  }
}
