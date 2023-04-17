import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LngLatLike } from 'mapbox-gl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  // constructor(public map:mapboxgl.Map){}

  ngOnInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiaGFyc2gta3lhZGEiLCJhIjoiY2xlNDNtaG43MDh1bTNuc2ExcWhnNDh6MCJ9.kfKxswm-yRFykKWzLMgegQ';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setupMap([position.coords.longitude, position.coords.latitude]);
      },
      () => {
        this.setupMap([72.62716163047467, 23.242181920407642]);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  setupMap(location: LngLatLike) {
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: location, // starting position [lng, lat]
      zoom: 14, // starting zoom
      projection: { name: 'mercator' },
    });

    const Locationmarker = new mapboxgl.Marker().setLngLat(location).addTo(map);
    let marker: mapboxgl.Marker

    map.on('click', (e) => {
      if(marker){
        marker.remove()
      }
      marker = new mapboxgl.Marker({
        color: 'red',
        draggable: true,
      })
        .setLngLat(e.lngLat)
        .addTo(map);
    });
  }
}
