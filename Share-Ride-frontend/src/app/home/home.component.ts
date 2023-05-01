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
  
  srcLocation: {
    cords: LngLatLike;
    place_name: string;
  } |undefined; 

  destLocation: {
    cords: LngLatLike;
    place_name: string;
  } | undefined; 

  Distance:number|undefined;
  Duration:string|undefined;
  cost:number|undefined
  
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
    if(this.destLocation){
      this.findRoute()
    }
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
    if(this.destLocation){
      this.findRoute()
    }
  }

  setDest(event:any){
    this.destLocation = {
      cords : event.geometry.coordinates ,
      place_name :event.place_name
    }
    this.putMarker(this.destLocation.cords, this.destMarker)   
    if(this.srcLocation){
      this.findRoute()
    } 
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
      if(this.destLocation){
        this.findRoute()
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
      if(this.srcLocation){
        this.findRoute()
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

  //findRoute
  findRoute(){
    const srccords:any=this.srcLocation?.cords
    const destcords:any= this.destLocation?.cords
    
    this.MapService.searchRoute(srccords[0],srccords[1],destcords[0],destcords[1]).subscribe((res:any)=> {
      console.log(res);
      const data = res.routes[0];
      this.Distance = (data.distance/1000);
      this.Duration = this.formateTime(data.duration/60)
      this.findCost(data.distance/1000, data.duration/60)
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

            // const data1 = res.routes[1];
            // const route1 = data1.geometry.coordinates;
            // const geojson1 = {
            //   type: 'Feature',
            //   properties: {},
            //   geometry: {
            //     type: 'LineString',
            //     coordinates: route1
            //   }
            // };

            // // if the route already exists on the map, we'll reset it using setData
            // if (this.map.getSource('route1')) {
            //   this.map.getSource('route1').setData(geojson1);
            // }
            // // otherwise, we'll make a new request
            // else {
            //   this.map.addLayer({
            //     id: 'route1',
            //     type: 'line',
            //     source: {
            //       type: 'geojson',
            //       data: geojson1
            //     },
            //     layout: {
            //       'line-join': 'round',
            //       'line-cap': 'round'
            //     },
            //     paint: {
            //       'line-color': 'red',
            //       'line-width': 7,
            //       'line-opacity': 0.75
            //     }
            //   });
            // }

      // if the route already exists on the map, we'll reset it using setData
      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
    })
  }

  //Formate Time
  formateTime(time:number){
    const hours = Math.floor(time/60)
    const minutes = Math.floor(time%60)
    if(hours<1){
      return minutes+'mins'
    }
    else{
      return hours+'hrs '+minutes+'mins'
    }
  }

  // findCost
  findCost(distance:number,time:number){
    this.cost = distance * 4 + time *3;
  }
}

