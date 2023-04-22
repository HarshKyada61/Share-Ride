import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit{
  user={
    'Name':'',
    'LicenceNo':''
  }

  constructor(public UserServic: UserService){}

  ngOnInit(){
    this.UserServic.getUser().subscribe((res:any) => {
      this.user.Name = res.Name
      this.user.LicenceNo = res.LicenceNo
    })
  }
}
