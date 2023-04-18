import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LngLatLike } from 'mapbox-gl';
import { debounce } from "debounce";
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { MapsService } from '../services/maps.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit ,OnDestroy{


  map:any;
  srcSubject= new Subject<string |undefined>()
  srcSub?:Subscription

  constructor(public MapService: MapsService){
    (mapboxgl as typeof mapboxgl).accessToken =
        'pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ';
  }

  curLocation?:LngLatLike
  curMarker=new mapboxgl.Marker()
  sourceMarker=new mapboxgl.Marker({ color: 'red', draggable: true})
  destMarker=new mapboxgl.Marker({ color: 'true', draggable: true})
  suggestedSrc:any=[]


  ngOnInit(){
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
       // starting position [lng, lat]
      zoom: 14, // starting zoom
      projection: { name: 'mercator' },
    }) 
    this.getCurrentLocation();

    this.srcSub = this.srcSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe((results) => {
      this.searchSrcLocation(results)
    });
  }

  searchSrcLocation(address:any){
    this.MapService.searchPlace(address).subscribe(results => { 
      this.suggestedSrc=results
      console.log(this.suggestedSrc);
    })
  }

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.curLocation =[position.coords.longitude, position.coords.latitude]
        this.putMarker(this.curLocation,this.curMarker);
        
      },
      () => {
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  //set given location to given marker
  putMarker(location: LngLatLike,marker:any) {
    this.map.setCenter(location)
    marker.setLngLat(location).addTo(this.map);
  }

  //listen to input
  input(event:Event){
    const srcLoc = (event.target as HTMLInputElement).value;
    this.srcSubject.next(srcLoc?.trim());
  }

  ngOnDestroy(): void {
    this.srcSub?.unsubscribe
  }
}
