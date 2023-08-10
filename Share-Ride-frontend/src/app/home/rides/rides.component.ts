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
    if (this.HomeService.socket) {
      this.HomeService.socket.disconnect();
    }
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
    if (this.HomeService.socket) {
      this.HomeService.socket.disconnect();
    }
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
        this.HomeService.requestedRides
          ? this.HomeService.requestedRides.push(requestedRide)
          : (this.HomeService.requestedRides = [requestedRide]);
        this.HomeService.socket.emit(
          'rideRequested',
          this.HomeService.ongoingRide,
          requestedRide
        );
        this.HomeService.socket.on(
          'requestAccepted',
          (ride: any, otp: any, status: any) => {
            this.HomeService.ridetoTake = ride;
            const el = document.querySelector('app-route-details');
            el?.classList.add('hide');
            this.HomeService.OTP = otp;
            this.HomeService.Status = status;
            this.HomeService.matchedRides = null;
          }
        );
        this.HomeService.socket.on('requestDeclined', async () => {
          btn.setAttribute('disabled', 'false');
          btn.innerHTML = 'Send Request';
          const index = this.HomeService.requestedRides.indexOf(requestedRide);
          this.HomeService.requestedRides.splice(index, 1);
        });

        this.HomeService.socket.on('otpVerifiedSuccess', (status: any) => {
          this.HomeService.Status = status;
          this.HomeService.OTP = undefined;
        });
      },
      error: (e) => {
        this.tostrService.error(e.message);
      },
    });
  }

  //accept Request
  acceptRequest(request: string, index: number) {
    this.RequestsService.updateRequest(
      { Status: 'Accepted' },
      request
    ).subscribe({
      next: (acceptedRide) => {
        this.HomeService.acceptedRides.push(acceptedRide);
        this.HomeService.requests.splice(index, 1);

        if (this.HomeService.available_Seats) {
          this.HomeService.available_Seats -= 1;
        }

        this.HomeService.socket.emit('acceptRide', request);
      },
      error: (e) => {
        this.tostrService.error(e.message);
      },
    });
  }

  //decline Request
  declineRequest(request: string, index: number) {
    this.RequestsService.updateRequest(
      { Status: 'Declined' },
      request
    ).subscribe(() => {
      this.HomeService.requests.splice(index, 1);
      this.HomeService.socket.emit('declineRide', request);
    });
  }
}
