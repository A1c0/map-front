import {Component, OnInit} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private heroesMap;

  private markers;

  private cities;

  constructor() {
    this.heroesMap = null;
    this.markers = null;
    this.cities = [];
  }

  ngOnInit() {
    this.heroesMap = L.map('heroesMap').setView([46.8, 2], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Heroes Map'
    }).addTo(this.heroesMap);
    this.markers = new L.LayerGroup();
    this.heroesMap.addLayer(this.markers);
    this.getCities();
    this.showCities();
  }

  addCity(city) {
    const marker = L.circle([city.lat, city.lng], {
      color: '#ff0026',
      fillColor: '#ff5b7e',
      fillOpacity: 0.4,
      radius: 20000
    }).addTo(this.markers);
    marker.bindPopup(''); // Je ne mets pas de texte par défaut
    const mapopup = marker.getPopup();
    mapopup.setContent(city.name);
  }

  getCities() {
    // Pour l'instant comme ça mais voir ensuite via un request promise
    this.cities = [
      {name: 'Paris', lat: '48.86', lng: '2.35'},
      {name: 'Lille', lat: '50.63', lng: '3.06'},
      {name: 'Brest', lat: '48.39', lng: '-4.49'},
      {name: 'Lyon', lat: '45.76', lng: '4.84'},
      {name: 'Toulouse', lat: '43.60', lng: '1.44'},
      {name: 'Marseille', lat: '43.30', lng: '5.37'},
      {name: 'Strasbourg', lat: '48.57', lng: '7.75'},
      {name: 'Nantes', lat: '47.22', lng: '-1.55'},
      {name: 'Bordeaux', lat: '44.84', lng: '-0.58'},
      {name: 'Montpellier', lat: '48.57', lng: '7.75'}
    ];
  }

  showCities() {
    this.cities.forEach(city => {
      this.addCity(city);
    });
  }
}
