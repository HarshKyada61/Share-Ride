import { Component } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent {

  constructor(public HomeService: HomeService){}
  

}
