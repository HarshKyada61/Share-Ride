import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LngLatLike } from 'mapbox-gl';
import { MapsService } from '../services/maps.service';
import { VehiclesService } from '../services/vehicles.service';
import { ToastrService } from 'ngx-toastr';
import { RideService } from '../services/rides.service';
import { NgForm } from '@angular/forms';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  map: any;
  el = document.createElement('div');
  
  searching=false;

  constructor(
    public MapService: MapsService,
    public Vehicleservice: VehiclesService,
    public HomeService: HomeService,
    private RideService: RideService
  ) {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ';
  }

  curLocation?: LngLatLike;
  curMarker = new mapboxgl.Marker({ element: this.el });
  sourceMarker = new mapboxgl.Marker({ color: 'red' });
  destMarker = new mapboxgl.Marker({ color: 'true' });

  // srcLocation:
  //   | {
  //       cords: LngLatLike;
  //       place_name: string;
  //     }
  //   | undefined;

  // destLocation:
  //   | {
  //       cords: LngLatLike;
  //       place_name: string;
  //     }
  //   | undefined;
  
  

  ngOnInit() {
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      // starting position [lng, lat]
      zoom: 14, // starting zoom
      projection: { name: 'mercator' },
    });
    this.el.innerHTML =
      '<i class="fa-solid fa-location-crosshairs fa-2x" style="color:#09baf0;"></i>';
    this.getCurrentLocation();

    this.Vehicleservice.getVehicles().subscribe((vehicles:any) => {
      this.HomeService.vehicles = vehicles
    })
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.curLocation = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        this.putMarker(this.curLocation, this.curMarker);
      },
      () => {},
      {
        enableHighAccuracy: true,
      }
    );
  }

  //set given location to given marker
  putMarker(location: LngLatLike, marker: any) {
    this.map.setCenter(location);
    marker.setLngLat(location).addTo(this.map);
  }

  //input form user
  setSrc(event: any) {
    this.HomeService.srcLocation = {
      cords: event.geometry.coordinates,
      place_name: event.place_name,
    };
    this.putMarker(this.HomeService.srcLocation.cords, this.sourceMarker);
    if (this.HomeService.destLocation) {
      this.findRoute();
    }
  }

  setAsCurLocation() {
    const srcCords: any = this.curLocation;
    this.putMarker(srcCords, this.sourceMarker);
    this.MapService.searchPlaceWithLatLon(srcCords[0], srcCords[1]).subscribe(
      (res: string) => {
        this.HomeService.srcLocation = {
          cords: srcCords,
          place_name: res,
        };
        if (this.HomeService.destLocation) {
          this.findRoute();
        }
      }
    );
    
  }

  setDest(event: any) {
    this.HomeService.destLocation = {
      cords: event.geometry.coordinates,
      place_name: event.place_name,
    };
    this.putMarker(this.HomeService.destLocation.cords, this.destMarker);
    if (this.HomeService.srcLocation) {
      this.findRoute();
    }
  }
  //

  //add on map
  setsrcMarker = (e: any) => {
    this.sourceMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat.lng, e.lngLat.lat).subscribe(
      (res: string) => {
        this.HomeService.srcLocation = {
          cords: [e.lngLat.lng, e.lngLat.lat],
          place_name: res,
        };
        if (this.HomeService.destLocation) {
          this.findRoute();
        }
      }
    );
  };

  setdestMarker = (e: any) => {
    this.destMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat.lng, e.lngLat.lat).subscribe(
      (res: string) => {
        this.HomeService.destLocation = {
          cords: [e.lngLat.lng, e.lngLat.lat],
          place_name: res,
        };
        if (this.HomeService.srcLocation) {
          this.findRoute();
        }
      }
    );
  };

  srcOnMap() {
    this.map.off('click', this.setdestMarker);
    this.map.on('click', this.setsrcMarker);
  }

  destOnMap() {
    this.map.off('click', this.setsrcMarker);
    this.map.on('click', this.setdestMarker);
  }
  //

  //findRoute
  findRoute() {
    const srccords: any = this.HomeService.srcLocation?.cords;
    const destcords: any = this.HomeService.destLocation?.cords;

    this.MapService.searchRoute(
      srccords[0],
      srccords[1],
      destcords[0],
      destcords[1]
    ).subscribe((res: any) => {
      const data = res.routes[0];
      this.HomeService.Distance = data.distance / 1000;
      this.HomeService.Duration = this.formateTime(data.duration / 60);
      this.findCost(data.distance / 1000, data.duration / 60);
      const route = data.geometry.coordinates;
      this.HomeService.route = route

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };

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
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }
    });
  }

  //Formate Time
  formateTime(time: number) {
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time % 60);
    if (hours < 1) {
      return minutes + 'mins';
    } else {
      return hours + 'hrs ' + minutes + 'mins';
    }
  }

  // findCost
  findCost(distance: number, time: number) {
    this.HomeService.cost = distance * 4 + time * 3;
  }

  //remove ClickListner from map
  removeListner(){
    this.map.off('click', this.setsrcMarker);
    this.map.off('click', this.setdestMarker);
  }
}
