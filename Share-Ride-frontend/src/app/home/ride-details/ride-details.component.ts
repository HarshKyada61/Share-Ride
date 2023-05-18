import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { RideService } from 'src/app/services/rides.service';

@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.css']
})
export class RideDetailsComponent implements OnInit {

  @Output() show  = new EventEmitter()

  constructor(public HomeService: HomeService, public RideService: RideService){}
  ngOnInit(): void {

    console.log(this.HomeService.acceptedRides);
    
  }

  CanceltakenRide() {
    this.HomeService.searchingRide = false;
    this.HomeService.ridetoTake = null
    this.RideService.updateTakenRide(
      { Status: 'cancelled' },
      this.HomeService.ongoingRide
    ).subscribe();
    this.show.emit();
  }

   //cancel offered Ride
   CancelOfferedRide() {
    this.HomeService.searchingRide = false;
    this.RideService.updateOfferedRide(
      { Status: 'cancelled' },
      this.HomeService.ongoingRide
    ).subscribe();
    this.HomeService.acceptedRides = [];
    this.show.emit();
  }
}
