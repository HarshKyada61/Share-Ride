import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { VehiclesService } from '../services/vehicles.service';
import { NgForm } from '@angular/forms';

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

  vehicels=[{
    'VehicleNo':'',
    'Type':'',
    'ModelName':'',
  }]

  isAddLicence=false

  constructor(public UserService: UserService, public VehiclesService:VehiclesService){}

  ngOnInit(){
    this.UserService.getUser().subscribe((res:any) => {
      this.user.Name = res.Name
      this.user.LicenceNo = res.LicenceNo
    })

    this.VehiclesService.getVehicles().subscribe((res:any) => {
      this.vehicels = res
    })
  }

  LicenceToggle(){
    this.isAddLicence=!this.isAddLicence
  }

  onSaveLicence(LicenceNo: any){
    this.UserService.updateUser({'LicenceNo':LicenceNo.value}).subscribe(() => {
      this.ngOnInit()
    })
    this.LicenceToggle()
  }

  addVehicle(form:NgForm){
    this.VehiclesService.addVehicle(form.value).subscribe(() => {
        this.ngOnInit()
    })
  }

}
