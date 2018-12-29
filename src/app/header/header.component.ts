import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Villains {
  value: string;
}
export interface Cities {
  name: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  villains: Villains[] = [
    {value: 'X'},
    {value: '5'},
    {value: '10'},
    {value: '20'},
    {value: '50'},
    {value: '100'}
  ];
  cities: Cities[] = [
    {name: 'city'}
  ];

  private nbVillains;
  private cityVillain;
  private cityHero;
  private citiesDB;

  constructor(private http: HttpClient) {
    this.nbVillains = Number;
    this.cityVillain = String;
    this.cityHero = String;
    this.citiesDB = null;
  }

  async ngOnInit() {
    await this.getCities();
  }

  onSelectVillain(val) {
    this.nbVillains = val;
  }
  onSelectCityVillain(val) {
    this.cityVillain = val;
  }
  onSelectCityHero(val) {
    this.cityHero = val;
  }

  async getCities() {
    const res = this.http.get('http://0.0.0.0:3090/getCities');
    this.citiesDB = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
    this.citiesDB.forEach(element => {
      this.cities.push({name: element.name_});
    });
  }

  async addVillains() {
    let i = 0;
    for (i = 0; i < this.nbVillains; i++) {
      const res = this.http.post('http://0.0.0.0:3060/newVillain', {name: 'Victor', city: this.cityVillain});
      await new Promise((resolve) => {
        res.subscribe(resolve);
      });
    }
  }

  async addHero(heroName) {
    const res = this.http.post('http://0.0.0.0:3070/newHero', {name: heroName, city: this.cityHero});
    await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

}
