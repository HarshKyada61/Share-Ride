import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user={
    'Name':'',
    'Email': '',
    'MobileNo': null,
    'Gender': ' '
  }

  constructor(public userService: UserService, public router: Router){}

  ngOnInit(): void {
    this.userService.getUser().subscribe((res:any) => {
      // console.log(res);
      this.user = res
    })
  }

  onDelete(){
    this.userService.deleteUser().subscribe(() => {
      localStorage.removeItem('token')
      this.router.navigate(['/auth'])
    })
  }
}
