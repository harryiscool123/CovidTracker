import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { ReportService } from './services/report.service';
import { MapMarkerService } from './services/map-marker.service';

import * as model from "./reportClass";
import report = model.CovidReport;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'covidTrackerTest';
  reports: report[] = [];

  mapReports: report[] = [];
  mapCoords: number[] = [];
  lat: number;
  lng: number;

  sortOptions: string[] = ['name','personReported','newest','oldest'];
  locationOptions: any[] = [];

  constructor(private rs: ReportService, private ms: MapMarkerService) { }

  ngOnInit() {
    // update report list once data is loaded from storage API
    this.rs.load().subscribe((data)=>{
      console.log(data);
      for (let x = 0; x < data.length; ++x) {
        let key = data[x].key;
        let id = parseInt(key.replace( /^\D+/g, ''));
        let loaded = data[x].data;
        let newReport = new report(loaded.name, loaded.phoneNumber, id, loaded.place, loaded.date, loaded.time, loaded.age, loaded.gender);
        this.reports.push(newReport);
      }
    this.rs.reportList = this.reports;
    this.mapReports = this.reports;
    this.locationOptions = this.ms.locations;
    console.log(this.mapReports);

    // this is the default sort option
    this.rs.sortByName();
    console.log(this.reports);
   })
  }

  sortReportsBy(option: MatSelectChange) {
    console.log(option);
    if (option.value === 'name'){
      this.rs.sortByName();
    }
    else if (option.value === 'personReported') {
      this.rs.sortByPersonReported();
    }
    else if (option.value === 'newest') {
      this.rs.sortByNewest();
    }
    else if (option.value === 'oldest') {
      this.rs.sortByOldest();
    }
  }

  onReportDeleted(evt: report) {
    console.log(evt);
    this.rs.delete(evt);
    this.ms.updateMarkers_decrement(evt);
  }

  getCoords(evt: number[]) {
    console.log(this.mapCoords);
    this.mapCoords = evt;
    this.lat = evt[0];
    this.lng = evt[1];
  }

  /*
  // Functions having to do with revealing additonal details for a report
  */
  onSeeMoreClicked(evt: report) {
    var additionalDetails = document.getElementById('additionalDetails');
    if (additionalDetails.style.visibility === 'hidden') {
      additionalDetails.style.visibility = 'visible';
    }
    document.getElementById('name').innerHTML = "<b>Additional Details For: " + evt.name + "</b>";
    document.getElementById('age').innerHTML = (evt.age).toString();
    document.getElementById('gender').innerHTML = evt.gender;
    document.getElementById('phoneNumber').innerHTML = evt.phoneNumber;
  }
  closeDetails() {
    document.getElementById('additionalDetails').style.visibility = 'hidden';
  }
}
