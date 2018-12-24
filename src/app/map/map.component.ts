import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.heroesMap = null;
    this.markers = null;
    this.cities = [];
  }

  async ngOnInit() {
    this.heroesMap = L.map('heroesMap').setView([46.8, 2], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Heroes Map'
    }).addTo(this.heroesMap);
    this.markers = new L.LayerGroup();
    this.heroesMap.addLayer(this.markers);
    await this.getCities();
    console.log(this.cities);
    this.showCities();
  }

  addCity(city) {
    const marker = L.circle([city.latitude_, city.longitude_], {
      color: '#001bff',
      fillColor: '#2ea4ff',
      fillOpacity: 0.4,
      radius: 20000
    }).addTo(this.markers);
    marker.bindPopup('');
    const mapopup = marker.getPopup();
    mapopup.setContent(city.name_);
  }

  async getCities() {
    const res = this.http.get(' http://0.0.0.0:3090/getCities');
    this.cities = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  showCities() {
    this.cities.forEach(city => {
      this.addCity(city);
    });
  }
}
