import { Component, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { NgForm } from '@angular/forms';
import { RideService } from 'src/app/services/rides.service';

@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.css']
})
export class RouteDetailsComponent {
  @Output() removeListnerEvent = new EventEmitter()
  @Output() hide  = new EventEmitter()

  constructor(public HomeService: HomeService, public RideService: RideService){}

  Distance=this.HomeService.Distance;
  Duration=this.HomeService.Duration;
  cost=this.HomeService.cost;
  vehicles=this.HomeService.vehicles;
  seats = [1,2,3];
  

  //create Ride
  offerRide(form:NgForm) {

    const index = form.value.vehicles
    const ride:{[key: string]: any} = {
      StartPoint: this.HomeService.srcLocation?.cords,
      EndPoint: this.HomeService.destLocation?.cords,
      vehicle: this.HomeService.vehicles[index]._id,
      distance: this.HomeService.Distance,
      duration: this.HomeService.Duration,
      Route: this.HomeService.route,
    }
    if(form.value.seats){
      ride['AvailableSeats']=form.value.seats
    }

    this.RideService.offerRide(ride).subscribe({next:res => {
      console.log('ride added')
      this.HomeService.searchingRide=true
      this.removeListnerEvent.emit();
      this.hide.emit()
    },
    error:e => console.log(e.message)
    })
  }

  //Take Ride
  takeRide(){
    const ride:{[key: string]: any} = {
      pickUpPoint: this.HomeService.srcLocation?.cords,
      DropPoint: this.HomeService.destLocation?.cords, 
      distance: this.HomeService.Distance,
      duration: this.HomeService.Duration,
      Route: this.HomeService.route,
      TotalFare: this.HomeService.cost
    }

    this.RideService.takeRide(ride).subscribe({next:res => {
      console.log('ride added')
      this.RideService.findRide(this.HomeService.route).subscribe({next:matchedRides => {
        console.log(matchedRides);
        this.HomeService.matchedRides= matchedRides
        this.HomeService.searchingRide = true,
        this.removeListnerEvent.emit();
        this.hide.emit()
      },error: e => console.log(e)
      })
    },
    error:e => console.log(e.message)
    })
  }

  
}
