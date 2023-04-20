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
export class HomeComponent implements OnInit{

  map:any;
  el = document.createElement('div');

 
  constructor(public MapService: MapsService){
    (mapboxgl as typeof mapboxgl).accessToken =
        'pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ';
  }

  curLocation?:LngLatLike
  curMarker=new mapboxgl.Marker( {element:this.el})
  sourceMarker=new mapboxgl.Marker({ color: 'red',})
  destMarker=new mapboxgl.Marker({ color: 'true'})

  srcLocation:{
    cords: LngLatLike;
    place_name: string;
  } | undefined

  destLocation : {
    cords: LngLatLike;
    place_name: string;
  } | undefined
  
  ngOnInit(){
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
       // starting position [lng, lat]
      zoom: 14, // starting zoom
      projection: { name: 'mercator' },
    }) 
    this.el.innerHTML = '<i class="fa-solid fa-location-crosshairs fa-2x" style="color:#09baf0;"></i>';
    this.getCurrentLocation();

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

  //input form user
  setSrc(event:any){
    this.srcLocation = {
      cords : event.geometry.coordinates ,
      place_name :event.place_name
    }
    this.putMarker(this.srcLocation.cords, this.sourceMarker)    
  }

  setAsCurLocation(){
    const srcCords:any= this.curLocation
    this.putMarker(srcCords, this.sourceMarker) 
    this.MapService.searchPlaceWithLatLon(srcCords[0],srcCords[1]).subscribe((res:string) => {
      this.srcLocation = {
        cords : srcCords,
        place_name :res
      }
    })

    
  }

  setDest(event:any){
    this.destLocation = {
      cords : event.geometry.coordinates ,
      place_name :event.place_name
    }
    this.putMarker(this.destLocation.cords, this.destMarker)    
  }
  //
 
  //add on map
  setsrcMarker =(e:any) => {
    this.sourceMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat.lng, e.lngLat.lat).subscribe((res:string) => {
      this.srcLocation = {
        cords : [e.lngLat.lng, e.lngLat.lat],
        place_name :res
      }
     
    })
  }

  setdestMarker =(e:any) => {
    this.destMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat.lng, e.lngLat.lat).subscribe((res:string) => {
      this.destLocation = {
        cords : [e.lngLat.lng, e.lngLat.lat],
        place_name :res
      }
    })
  }

  srcOnMap(){
    this.map.off('click',this.setdestMarker)
    this.map.on('click',this.setsrcMarker)
  }

  destOnMap(){
    this.map.off('click',this.setsrcMarker)
    this.map.on('click',this.setdestMarker)
  }
  //
}
