import { Component, EventEmitter, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { RideService } from 'src/app/services/rides.service';
import { RequestsService } from 'src/app/services/requests.service';
import { ToastrService } from 'ngx-toastr';
import { clearStorage } from 'mapbox-gl';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css'],
})
export class RidesComponent {
  @Output() show = new EventEmitter();

  constructor(
    public HomeService: HomeService,
    public RideService: RideService,
    public RequestsService: RequestsService,
    public tostrService: ToastrService
  ) {}

  //cancel offered Ride
  CancelOfferedRide() {
    this.HomeService.searchingRide = false;
    this.RideService.updateOfferedRide(
      { Status: 'cancelled' },
      this.HomeService.ongoingRide
    ).subscribe();
    this.HomeService.requests = null;
    this.show.emit();
  }

  //cancel taken Ride
  CanceltakenRide() {
    this.HomeService.searchingRide = false;
    this.HomeService.matchedRides = null;
    this.RideService.updateTakenRide(
      { Status: 'cancelled' },
      this.HomeService.ongoingRide
    ).subscribe();
    this.show.emit();
  }

  //send Request
  sendRequest(event: Event, requestedRide: string) {
    const btn = event.target as HTMLInputElement;
    btn.setAttribute('disabled', 'true');
    btn.innerHTML = 'Requsted';

    this.RequestsService.sendRequest(
      this.HomeService.ongoingRide,
      requestedRide
    ).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (e) => {
        this.tostrService.error(e.message);
      },
    });
  }

  //accept Request
  acceptRequest(request: string,index:number) {
    this.RequestsService.updateRequest(
      { Status: 'Accepted' },
      request
    ).subscribe({
      next: (acceptedRide) => {
        // console.log(acceptedRide);
        
        console.log('Request Accepted')
        this.HomeService.acceptedRides.push(acceptedRide)
        this.HomeService.requests.splice( index, 1)
        console.log(this.HomeService.ongoingRide);

        if(this.HomeService.available_Seats){
          this.HomeService.available_Seats -= 1; 
        }
        
      },
      error: (e) => {
        this.tostrService.error(e.message);
      },
    });
  }

  //decline Request
  declineRequest(request: string, index:number) {
    this.RequestsService.updateRequest(
      { Status: 'Declined' },
      request
    ).subscribe(() => {
      console.log('Request Declined')
      this.HomeService.requests.splice( index, 1)
    });
  }
}
