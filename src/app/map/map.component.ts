import {Component, OnInit} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private heroesMap;

  constructor() {
  }

  ngOnInit() {
    this.heroesMap = L.map('heroesMap').setView([46.8, 2], 6);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Heroes Map'
    }).addTo(this.heroesMap);
  }

}
