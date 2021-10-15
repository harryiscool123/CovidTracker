/// <reference types="@types/googlemaps" />

import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { MapMarkerService } from '../services/map-marker.service';

import * as model from '../reportClass';
import report = model.CovidReport;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() reports: report[];
  @Output() sendCoord = new EventEmitter();

  @ViewChild('gmap') gmapElement;
  map: google.maps.Map;

  constructor(private ms: MapMarkerService) { }

  coordinates: number[] = [];
  // customize view for the google maps portion of the app
  ngAfterViewInit() {
    var mapProp = {
      center: new google.maps.LatLng(49.2, -123),
      zoom: 10
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.ms.setMap(this.map);

    // Configure the click listener.
    this.map.addListener("click", (mapsMouseEvent) => {

    let LatLng = mapsMouseEvent.latLng.toJSON();
    console.log(LatLng);

    this.coordinates[0] = LatLng.lat;
    this.coordinates[1] = LatLng.lng;
    this.sendCoord.emit(this.coordinates);
    });
  }

  ngOnChanges(): void {
    console.log(this.reports);
    if (this.reports != null) this.ms.loadLocations(this.reports);
  }

  ngOnInit(): void { }
}
