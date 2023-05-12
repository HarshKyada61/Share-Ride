import { Component, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { RideService } from 'src/app/services/rides.service';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent {
  @Output() show= new EventEmitter()

  constructor(public HomeService: HomeService, public RideService: RideService){}
  
  //cancel offered Ride
  CancelOfferedRide(){
    this.HomeService.searchingRide= false;
    this.HomeService.matchedRides= null;
    this.RideService.updateOfferedRide({Status:'canceled'}, this.HomeService.ongoingRide).subscribe()
    this.show.emit()
  }

  //cancel taken Ride
  CanceltakenRide(){
    this.HomeService.searchingRide= false;
    this.HomeService.matchedRides= null;
    this.RideService.updateTakenRide({Status:'cancelled'}, this.HomeService.ongoingRide).subscribe()
    this.show.emit()
  }
}
