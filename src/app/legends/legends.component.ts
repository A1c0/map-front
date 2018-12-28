import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as R from 'ramda';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.css']
})
export class LegendsComponent implements OnInit {

  private villains;
  private villainsByCities;
  private heroes;

  constructor(private http: HttpClient) {
    this.villains = null;
    this.villainsByCities = null;
    this.heroes = null;
  }

  async ngOnInit() {
    await this.getVillains();
    await this.getVillainsByCity();
    await this.getHeroes();
    setInterval(() => {
      this.getVillains();
      this.getVillainsByCity();
      this.getHeroes();
    }, 1000);
  }

  async getVillains() {
    const res = this.http.get(' http://0.0.0.0:3060/getVillains');
    this.villains = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  async getVillainsByCity() {
    const res = this.http.post('http://0.0.0.0:3060/countVillainsByCities', this.villains);
    this.villainsByCities = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  async getHeroes() {
    const res = this.http.get('http://0.0.0.0:3070/getHeroesFront');
    this.heroes = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  show(posHero) {
    const getMove = R.pipe(
      R.split('move'),
      R.insert(1, ' -> '),
      R.reduce(R.concat, ''),
    );

    const transform = R.ifElse(
      R.contains('move'),
      getMove,
      R.identity,
    );

    return transform(posHero);
  }
}
