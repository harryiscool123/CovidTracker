/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';

import * as model from '../reportClass';
import report = model.CovidReport;
import place = model.place;

import * as model2 from '../markerClass';
import covidMarker = model2.covidMarker;

@Injectable({
  providedIn: 'root'
})
export class MapMarkerService {
  markers: covidMarker[] = [];
  locations: place[] = [];
  map: google.maps.Map = null;

  constructor() { }

  setMap(parentMap: google.maps.Map) {
    this.map = parentMap;
  }

  // load locations from the report service
  loadLocations(reportList: report[]) {
    if (reportList == null) return;

    // push all place objects onto locations[]
    for (let i = 0; i < reportList.length; ++i) {
      this.locations.push(reportList[i].place);
    }

    // remove any duplicate location names
    this.locations = this.locations.filter((elem, index, self) => self.findIndex(
      (t) => {return (t.locationName === elem.locationName)}) === index)
    console.log(this.locations)

    // add markers
    let markerName = [];
    for (let i = 0; i < this.markers.length; ++i) {
      markerName.push(this.markers[i].id);
    }

    for (let i = 0; i < this.locations.length; ++i) {
      if (markerName.indexOf(this.locations[i].locationName)) {
        this.addMarker(this.locations[i], this.map);
      }
    }
    console.log(reportList);
    this.updateMarkers_increment(reportList);
  }

  addMarker(location: place,  parentMap: google.maps.Map) {
    console.log(location);
    let marker = new google.maps.Marker({
      position: {lat: location.latitude , lng: location.longitude},
      map: parentMap,
      label: { fontWeight:'bold', fontSize:'8px', text: location.locationName},
      title: 'Cases Reported'
    });
    // add marker to markerList so we can 'remember' it
    let newCovidMarker = new covidMarker(location.locationName, marker, 0);
    this.markers.push(newCovidMarker);
    console.log(this.markers);
  }

  // update markers with current report counts
  updateMarkers_increment(reportList: report[]) {
    // first reset all markers
    for (let i = 0; i < this.markers.length; ++i) {
      this.markers[i].reportCount = 0;
    }

    for (var i = 0; i < reportList.length; ++i) {
      for (var j = 0; j < this.markers.length; ++j) {
        if (reportList[i].place.locationName === this.markers[j].id) {
          this.markers[j].incrementReportCount(this.map);
        }
      }
    }
  }

  // when a report is deleted decrement its report count
  updateMarkers_decrement(deletedReport: report) {
    for (var i = 0; i < this.markers.length; ++ i) {
      if (this.markers[i].id === deletedReport.place.locationName) {
        this.markers[i].decrementReportCount();
      }
    }
  }
}
