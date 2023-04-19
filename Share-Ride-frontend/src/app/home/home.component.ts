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
 
  constructor(public MapService: MapsService){
    (mapboxgl as typeof mapboxgl).accessToken =
        'pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ';
  }

  curLocation?:LngLatLike
  curMarker=new mapboxgl.Marker()
  sourceMarker=new mapboxgl.Marker({ color: 'red'})
  destMarker=new mapboxgl.Marker({ color: 'true'})
  srcLocation=''
  destLocation = ''
  
  ngOnInit(){
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
       // starting position [lng, lat]
      zoom: 14, // starting zoom
      projection: { name: 'mercator' },
    }) 
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

  setSrc(event:any){
    this.srcLocation = event
    const srcCords= event.geometry.coordinates
    this.putMarker(srcCords, this.sourceMarker)    
  }

  setAsCurLocation(){
    const srcCords:any= this.curLocation
    // this.curMarker.remove()
    this.putMarker(srcCords, this.sourceMarker)    
  }

  setDest(event:any){
    this.destLocation = event
    const destCords= event.geometry.coordinates
    this.putMarker(destCords, this.destMarker)    
  }

  // addonclick(marker:mapboxgl.Marker){
  //   this.map.on('click', (e:any) => {
  //     marker.setLngLat(e.lngLat).addTo(this.map);
  //   })
  // }

 
  setsrcMarker =(e:any) => {
    this.sourceMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat).subscribe(res => {
      console.log(res);
    })
  }

  setdestMarker =(e:any) => {
    this.destMarker.setLngLat(e.lngLat).addTo(this.map);
  }

  srcOnMap(){
    this.map.off('click',this.setdestMarker)
    this.map.on('click',this.setsrcMarker)
  }

  destOnMap(){
    this.map.off('click',this.setsrcMarker)
    this.map.on('click',this.setdestMarker)
  }
}
