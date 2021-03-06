import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as L from 'leaflet';
import * as R from 'ramda';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private heroesMap;

  private markersCities;

  private markersHeroes;

  private cities;

  private heroes;

  constructor(private http: HttpClient) {
    this.heroesMap = null;
    this.markersCities = null;
    this.markersHeroes = null;
    this.cities = [];
    this.heroes = [];
  }

  async ngOnInit() {
    this.heroesMap = L.map('heroesMap').setView([46.8, 2], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Heroes Map'
    }).addTo(this.heroesMap);
    this.markersCities = new L.LayerGroup();
    this.markersHeroes = new L.LayerGroup();
    this.heroesMap.addLayer(this.markersCities);
    this.heroesMap.addLayer(this.markersHeroes);
    await this.getCities();
    this.showCities();
    this.startRefreshHeroes();
  }

  async getWeather(name, latitude, longitude) {
    const apiKey = '74d9f6867ef4e6160c30707ea5b8bf0b';
    const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${latitude}&lon=${longitude}&units=metric`;
    const res = await this.http.get(url);
    const data = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
    let output = `<h3>${name}</h3><br>`;
    data['weather'].forEach(elm => {
      output += `${elm.main}.<br>`;
    });
    output += `${Math.round(data['main'].temp)}°C</p>`;
    return output;
  }

  async addCity(city) {
    const marker = L.circle([city.latitude_, city.longitude_], {
      color: '#001bff',
      fillColor: '#2ea4ff',
      fillOpacity: 0.5,
      radius: 20000
    }).addTo(this.markersCities);
    marker.bindPopup('');
    const mapopup = marker.getPopup();
    mapopup.setContent(await this.getWeather(city.name_, city.latitude_, city.longitude_));
  }

  async updateHeroesPos() {

    const getCity = name => R.pipe(
      // @ts-ignore
      R.filter(x => x.name_ === name),
      R.head
    )(this.cities);

    this.markersHeroes.clearLayers();
    await this.getHeroes();
    this.heroes.forEach(hero => {
      if (!hero.moving) {
        const cityHeroes = getCity(hero.pos);
        L.circle([cityHeroes.latitude_, cityHeroes.longitude_], {
          stroke: false,
          fill: true,
          fillColor: '#ff6800',
          fillOpacity: 0.7,
          radius: 10000
        }).addTo(this.markersHeroes);
      } else {
        let color ='';
        if (hero.mountUsed) {
          color ='#8607ff';
        } else {
          color ='#ff000e';
        }
        const citiesMoveHeroes = R.pipe(
          R.split('move'),
          R.map(getCity)
        )(hero.pos);
        L.circle([citiesMoveHeroes[0].latitude_, citiesMoveHeroes[0].longitude_], {
          stroke: false,
          fill: true,
          fillColor: color,
          fillOpacity: 0.7,
          radius: 10000
        }).addTo(this.markersHeroes);
        L.polygon([
          [citiesMoveHeroes[0].latitude_, citiesMoveHeroes[0].longitude_],
          [citiesMoveHeroes[1].latitude_, citiesMoveHeroes[1].longitude_],
        ], {
          color: color,
          fill: true,
          fillColor: color,
          fillOpacity: 0.7
        }).addTo(this.markersHeroes);
      }
    });
  }

  async getCities() {
    const res = this.http.get('http://0.0.0.0:3090/getCities');
    this.cities = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  async getHeroes() {
    const res = this.http.get('http://0.0.0.0:3070/getHeroesFront');
    this.heroes = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  startRefreshHeroes() {
    setInterval(async () => {
      await this.updateHeroesPos();
    }, 500);
  }

  showCities() {
    this.cities.forEach(city => {
      this.addCity(city);
    });
  }
}
