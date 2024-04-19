import { Component, OnInit } from '@angular/core';
import { LngLatLike } from 'maplibre-gl';

@Component({
  selector: 'ratio-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  popupLocation: LngLatLike;
  constructor() {}

  public ngOnInit() {}
}
