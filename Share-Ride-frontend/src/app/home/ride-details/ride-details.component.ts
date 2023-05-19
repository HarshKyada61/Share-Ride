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
  @Output() ShowPickupDrop = new EventEmitter<any>()

  constructor(public HomeService: HomeService, public RideService: RideService){}
  ngOnInit(): void {
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

  onclick(ride:any){
    this.ShowPickupDrop.emit({id:ride._id, pickUp:ride.pickUpPoint, drop: ride.DropPoint})
  }
}
