import { Component, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { NgForm } from '@angular/forms';
import { RideService } from 'src/app/services/rides.service';
import { RequestsService } from 'src/app/services/requests.service';
import { io } from "socket.io-client";

@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.css']
})
export class RouteDetailsComponent {
  @Output() removeListnerEvent = new EventEmitter()
  @Output() hide  = new EventEmitter()

  constructor(public HomeService: HomeService, public RideService: RideService, public RequestService: RequestsService){}

  vehicles=this.HomeService.vehicles;
  seats = [1,2,3];
  
  

  //create Ride
  offerRide(form:NgForm) {

    const index = form.value.vehicles
    const ride:{[key: string]: any} = {
      StartPoint: this.HomeService.srcLocation,
      EndPoint: this.HomeService.destLocation,
      vehicle: this.HomeService.vehicles[index]._id,
      distance: this.HomeService.Distance,
      duration: this.HomeService.Duration,
      Route: this.HomeService.route,
    }
    if(form.value.seats){
      ride['AvailableSeats']=form.value.seats;
      this.HomeService.available_Seats = form.value.seats
    }else{
      this.HomeService.available_Seats = 1
    }

    this.RideService.offerRide(ride).subscribe({next:(res:any) => {
      
      console.log('ride added')
      this.HomeService.searchingRide=true
      this.removeListnerEvent.emit();
      this.hide.emit()
      this.HomeService.ongoingRide = res;

      this.HomeService.socket = io("http://localhost:3000");
      this.HomeService.socket.emit('rideOffered',res)

      this.RequestService.getRequests(this.HomeService.ongoingRide).subscribe(requests => {
        this.HomeService.requests = requests
        
      })
    },
    error:e => console.log(e.message)
    })
  }

  //Take Ride
  takeRide(){
    const ride:{[key: string]: any} = {
      pickUpPoint: this.HomeService.srcLocation,
      DropPoint: this.HomeService.destLocation, 
      distance: this.HomeService.Distance,
      duration: this.HomeService.Duration,
      Route: this.HomeService.route,
      TotalFare: this.HomeService.cost
    }

    this.RideService.takeRide(ride).subscribe({next:(res:any) => {
      console.log('ride added')
      this.HomeService.ongoingRide = res
      this.HomeService.socket = io("http://localhost:3000")
      this.HomeService.socket.on('OfferedRide', (offeredRide:any) => {
        console.log(offeredRide);
        
      })
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
