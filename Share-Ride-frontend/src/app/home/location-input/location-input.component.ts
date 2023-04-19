import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Subject } from 'rxjs';
import { MapsService } from 'src/app/services/maps.service';

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.css']
})
export class LocationInputComponent implements OnInit{

  @Output() SetLocationEvent = new EventEmitter<object>()
  @Output() SetCurLocationEvent = new EventEmitter()
  @Output() chosefromMap = new EventEmitter()

  locationSubject= new Subject<string |undefined>()
  locationSubscription?:Subscription
  suggestedSrc:any=[]
  id:string;
  location='';

  constructor(public MapService: MapsService,private elementRef: ElementRef){
    this.id = this.elementRef.nativeElement.getAttribute('id');
  }

  ngOnInit(): void {
    this.locationSubscription = this.locationSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe((results:any) => {
      this.searchSrcLocation(results)
    });
  }

  //Search for match of inserted address
  searchSrcLocation(address:any){
    this.MapService.searchPlace(address).subscribe(results => { 
      this.suggestedSrc=results
    })
  }

  //listne to input
  input(event:Event){
    const srcLoc = (event.target as HTMLInputElement).value;
    this.locationSubject.next(srcLoc?.trim());
  }

  ngOnDestroy(): void {
    this.locationSubscription?.unsubscribe
  }

  //emit event to set chosen location
  setLocation(index:number){
    this.location = this.suggestedSrc[index].place_name,
    this.SetLocationEvent.emit(this.suggestedSrc[index]);
  }

  //emit event to set current location
  setCurLocation(){
    this.SetCurLocationEvent.emit();
  }

  onChosefromMap(){
    this.chosefromMap.emit();
  }
}
