import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

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

  constructor(public ProfileService: ProfileService){}

  ngOnInit(): void {
    this.ProfileService.getUser().subscribe((res:any) => {
      console.log(res);
      this.user = res
    })
  }
}
