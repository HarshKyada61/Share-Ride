import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HomeService } from '../home.service';
import { RideService } from 'src/app/services/rides.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.css']
})
export class RideDetailsComponent implements OnInit {

  @Output() show  = new EventEmitter()
  @Output() ShowPickupDrop = new EventEmitter<any>()

  constructor(public HomeService: HomeService, public RideService: RideService, private toastr: ToastrService){}
  ngOnInit(): void {
      if(this.HomeService.Status === 'RequestedToEnd'){
        console.log('requested to end');

        let myModal = document.getElementById("exampleModal");
        myModal?.classList.add("show");
        (myModal as HTMLDivElement).style.display = "block";
        document.body.classList.add("modal-open");
      }
  }

  closeModal(){
    let myModal = document.getElementById("exampleModal");
        myModal?.classList.remove("show");
        (myModal as HTMLDivElement).style.display = "none";
        document.body.classList.remove("modal-open");
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

  submitOTP(form:NgForm,ride_ID:string){
    console.log(form.value.otp);
    this.RideService.validateOTP(ride_ID,form.value.otp).subscribe({next: () => {
      this.toastr.success('OTP Verified Successfully')
    }, error: (e) => {
      this.toastr.error(e.message)
    } })
  }

  RequestToEndRide(event:Event,rideID:string){
    this.RideService.updateTakenRide(
      { Status: 'RequestedToEnd' },
      rideID
    ).subscribe(() => {
      const btn = event.target as HTMLInputElement;
      btn.setAttribute('disabled', 'true');
      btn.innerHTML = 'Requested To End';
    });
  }
}
