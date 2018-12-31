import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as R from 'ramda';
import {__await} from 'tslib';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.css']
})
export class LegendsComponent implements OnInit {

  private villains;
  private villainsByCities;
  private heroes;
  private mountsPerCities;

  public citiesInfo;

  constructor(private http: HttpClient) {
    this.villains = null;
    this.villainsByCities = null;
    this.heroes = null;
  }

  async ngOnInit() {
    setInterval(async() => {
      await this.getVillains();
      await this.getVillainsByCity();
      await this.getHeroes();
      await this.getMountsPerCity();
      this.mergeInfo();
    }, 1000);
  }

  async getVillains() {
    const res = this.http.get(' http://0.0.0.0:3060/getVillains');
    this.villains = await new Promise((resolve) => {
      res.subscribe(resolve);
    });
  }

  async getMountsPerCity() {
    const res = this.http.get(' http://0.0.0.0:3080/getMountsPerCity');
    this.mountsPerCities = await new Promise((resolve) => {
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
      R.insert(1, ' → '),
      R.reduce(R.concat, ''),
    );

    const transform = R.ifElse(
      R.contains('move'),
      getMove,
      R.identity,
    );

    return transform(posHero);
  }

  private mergeInfo() {
    const getNbMountsByCity = city => R.pipe(
      R.filter(x => R.pipe(
        R.prop('city'),
        R.equals(city)
      )(x)),
      R.head,
      R.prop('count'),
    )(this.mountsPerCities);

    const correct = R.ifElse(
      R.isNil,
      R.always(0),
      R.identity
    );

    const addMountsCount = city => R.assoc('mountsCount', R.pipe(
      R.prop('name'),
      getNbMountsByCity,
      correct
    )(city), city);

    this.citiesInfo = R.map(addMountsCount, this.villainsByCities);
  }
}
