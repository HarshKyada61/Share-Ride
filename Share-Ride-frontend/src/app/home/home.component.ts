import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LngLatLike } from 'mapbox-gl';
import { MapsService } from '../services/maps.service';
import { VehiclesService } from '../services/vehicles.service';
import { ToastrService } from 'ngx-toastr';
import { RideService } from '../services/rides.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  map: any;
  el = document.createElement('div');
  seats = [1,2,3];

  constructor(
    public MapService: MapsService,
    public Vehicleservice: VehiclesService,
    private toastr: ToastrService,
    private RideService: RideService
  ) {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ';
  }

  curLocation?: LngLatLike;
  curMarker = new mapboxgl.Marker({ element: this.el });
  sourceMarker = new mapboxgl.Marker({ color: 'red' });
  destMarker = new mapboxgl.Marker({ color: 'true' });

  srcLocation:
    | {
        cords: LngLatLike;
        place_name: string;
      }
    | undefined;

  destLocation:
    | {
        cords: LngLatLike;
        place_name: string;
      }
    | undefined;
  route: Number[][] | undefined;
  vehicles:{VehicleNo:string, _id:string, Type:string}[] = []

  Distance: number | undefined;
  Duration: string | undefined;
  cost: number | undefined;

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
      this.vehicles = vehicles
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
    this.srcLocation = {
      cords: event.geometry.coordinates,
      place_name: event.place_name,
    };
    this.putMarker(this.srcLocation.cords, this.sourceMarker);
    if (this.destLocation) {
      this.findRoute();
    }
  }

  setAsCurLocation() {
    const srcCords: any = this.curLocation;
    this.putMarker(srcCords, this.sourceMarker);
    this.MapService.searchPlaceWithLatLon(srcCords[0], srcCords[1]).subscribe(
      (res: string) => {
        this.srcLocation = {
          cords: srcCords,
          place_name: res,
        };
      }
    );
    if (this.destLocation) {
      this.findRoute();
    }
  }

  setDest(event: any) {
    this.destLocation = {
      cords: event.geometry.coordinates,
      place_name: event.place_name,
    };
    this.putMarker(this.destLocation.cords, this.destMarker);
    if (this.srcLocation) {
      this.findRoute();
    }
  }
  //

  //add on map
  setsrcMarker = (e: any) => {
    this.sourceMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat.lng, e.lngLat.lat).subscribe(
      (res: string) => {
        this.srcLocation = {
          cords: [e.lngLat.lng, e.lngLat.lat],
          place_name: res,
        };
        if (this.destLocation) {
          this.findRoute();
        }
      }
    );
  };

  setdestMarker = (e: any) => {
    this.destMarker.setLngLat(e.lngLat).addTo(this.map);
    this.MapService.searchPlaceWithLatLon(e.lngLat.lng, e.lngLat.lat).subscribe(
      (res: string) => {
        this.destLocation = {
          cords: [e.lngLat.lng, e.lngLat.lat],
          place_name: res,
        };
        if (this.srcLocation) {
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
    const srccords: any = this.srcLocation?.cords;
    const destcords: any = this.destLocation?.cords;

    this.MapService.searchRoute(
      srccords[0],
      srccords[1],
      destcords[0],
      destcords[1]
    ).subscribe((res: any) => {
      const data = res.routes[0];
      console.log(data);

      this.Distance = data.distance / 1000;
      this.Duration = this.formateTime(data.duration / 60);
      this.findCost(data.distance / 1000, data.duration / 60);
      const route = data.geometry.coordinates;
      this.route = route

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
    this.cost = distance * 4 + time * 3;
  }

  

  //create Ride
  createRide(form:NgForm) {

    const index = form.value.vehicles
    const ride:{[key: string]: any} = {
      StartPoint: this.srcLocation?.cords,
      EndPoint: this.destLocation?.cords,
      vehicle: this.vehicles[index]._id,
      distance: this.Distance,
      duration: this.Duration,
      Route: this.route,
    }
    if(form.value.seats){
      ride['AvailableSeats']=form.value.seats
    }

    this.RideService.createRide(ride).subscribe({next:res => {
      console.log('ride added')
      this.map.off('click', this.setdestMarker);
      this.map.off('click', this.setdestMarker);
    },
    error:e => console.log(e.message)
    })
  }
}
