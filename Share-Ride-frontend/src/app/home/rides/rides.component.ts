import { Component, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { RideService } from 'src/app/services/rides.service';
import { RequestsService } from 'src/app/services/requests.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent {
  @Output() show= new EventEmitter()

  constructor(public HomeService: HomeService, public RideService: RideService, public RequestsService: RequestsService, public tostrService: ToastrService){}
  
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

  //send Request
  sendRequest(requestedRide:string){
    this.RequestsService.sendRequest(this.HomeService.ongoingRide, requestedRide).subscribe({next:res => {
      console.log(res);
  },error: (e) => {
    this.tostrService.error('This Ride is Full!!')
  }})
  }

  //accept Request
  acceptRequest(request:string){
      this.RequestsService.updateRequest({Status:'Accepted'}, request).subscribe(() => console.log('Request Accepted')
      )
  }
}
