import { Component, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent {
  @Output() show= new EventEmitter()

  constructor(public HomeService: HomeService){}
  
  //cancel Ride
  CancelRide(){
    this.HomeService.searchingRide= false;
    this.HomeService.matchedRides= null;
    this.show.emit()
  }
}
