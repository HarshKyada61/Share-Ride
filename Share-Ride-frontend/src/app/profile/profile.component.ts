import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';


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
    'Gender': '',
    'DOB':'',
  }
  isNew= false;
  @ViewChild('updateModel') updateModel: HTMLElement | undefined

  constructor(public userService: UserService, private router: Router){}

  ngOnInit(): void {
    this.userService.getUser().subscribe((res:any) => {
      this.user.Name = res.Name,
      this.user.Email = res.Email,
      this.user.MobileNo = res.MobileNo,
      res.DOB?this.user.DOB=res.DOB:this.user.DOB='',
      res.Gender?this.user.Gender=res.Gender:this.user.Gender=''
    })

    if(this.router.url.includes('new')){
      let elemet: HTMLElement = document.getElementById('openModel') as HTMLElement;
      elemet.click();
    }
    
  }

  onUpdate(Name:HTMLInputElement,Email:HTMLInputElement,Gender:NgModel,DOB:HTMLInputElement){
    const updatedUser:{[key:string]:any}={}
    if(this.user.Name !== Name.value) { updatedUser['Name'] = Name.value}
    if(this.user.Email !== Email.value) {updatedUser['Email'] = Email.value}
    if(this.user.Gender !== Gender.value) {updatedUser['Gender'] = Gender.value}
    if(this.user.DOB !== DOB.value) {updatedUser['DOB'] = DOB.value} 
    

    this.userService.updateUser(updatedUser).subscribe(() => {
      if(this.router.url.includes('new')){
        this.router.navigate(['/profile'])
        return
      }
      this.ngOnInit();
    })
  }

  onDelete(){
    this.userService.deleteUser().subscribe(() => {
      localStorage.removeItem('token')
      this.router.navigate(['/auth'])
    })
  }
}
