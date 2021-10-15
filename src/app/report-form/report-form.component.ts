import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { ReportService } from '../services/report.service';

import * as model from '../reportClass';
import report = model.CovidReport;
import place = model.place;

import { MapMarkerService } from '../services/map-marker.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})

export class ReportFormComponent implements OnInit, OnChanges {
  @Input() newLat: number;
  @Input() newLng: number;
  @Input() newLocations: place[]; // add in new locations so user can select existing locations

  form: FormGroup;
  maxDate = (new Date());
  placeOptions: place[] = [];

  // these are the default location options
  SFU_Burn = new place("SFU Burnaby", -122.9192, 49.2787);
  SFU_Sur = new place("SFU Surrey", -122.8490, 49.1867);
  Metro = new place("Metrotown", -123.0076, 49.2276);
  Richmond = new place("Richmond Centre", -123.1336, 49.1666)
  Pacific = new place("Pacific Centre", -123.1184, 49.2833);
  UBC = new place("UBC", -123.2460, 49.2606,)
  default_places: place[] = [this.SFU_Burn, this.SFU_Sur, this.Metro, this.Richmond, this.Pacific, this.UBC];

  constructor(private rs: ReportService, private ms: MapMarkerService) { }

  ngOnInit(): void {
    this.placeOptions = this.default_places;
    document.getElementById('revealForm').addEventListener('click', function() { showForm(); });

    this.form = new FormGroup({
      name: new FormControl(),
      phoneNumber: new FormControl(),
      age: new FormControl('age'),
      gender: new FormControl('gender'),
      date: new FormControl('date'),
      time: new FormControl('time'),
      place_name: new FormControl(),
      place_latitude: new FormControl('latitude'),
      place_longitude: new FormControl('longitude')
    });
  }

  ngOnChanges(): void {
    console.log("Changed");
    console.log(this.newLat);
    console.log(this.newLng)
    this.form.controls['place_latitude'].setValue(this.newLat);
    this.form.controls['place_longitude'].setValue(this.newLng);
    this.placeOptions = this.default_places;

    // add in new locations aside from the default ones
    for (let i = 0; i < this.newLocations.length; ++i) {
      console.log(this.newLocations[i]);
      this.placeOptions.push(this.newLocations[i]);
    }
    // remove any duplicate locations
    this.placeOptions = this.placeOptions.filter((elem, index, self) => self.findIndex(
      (t) => {return (t.locationName === elem.locationName)}) === index);
  }

  onSubmit(input: any) {
    let input_place = new place(input.place_name, Number(input.place_longitude), Number(input.place_latitude));
    this.placeOptions.push(input_place);
    // if place is duplicate then remove it
    this.placeOptions = this.placeOptions.filter((elem, index, self) => self.findIndex(
      (t) => {return (t.locationName === elem.locationName)}) === index);

    let newReport = new report(input.name, input.phoneNumber, 0, input_place, input.date, input.time, input.age, input.gender);

    // make sure all inputs are filled 
    if ((newReport.date).toString() === 'date' || newReport.time === 'time') {
      alert('Please Fill In All Time Fields');
    } else if (newReport.gender === "gender") {
      alert('Please Specify a Gender');
    } else if (Number.isNaN(newReport.place.latitude) || Number.isNaN(newReport.place.longitude)) {
      alert('Please Enter Coordinates');
    } else if ((newReport.age).toString() === "age") {
      alert('Please Specify an Age');
    }
    else {
      let date:string = (newReport.date).toString();
      newReport.date = (date).replace("00:00",newReport.time);
      this.rs.add(newReport);
      this.ms.loadLocations(this.rs.reportList);
    }
  }

  fillPlaceForm(place: MatSelectChange) {
    this.form.controls['place_name'].setValue(place.value.locationName);
    this.form.controls['place_latitude'].setValue(place.value.latitude);
    this.form.controls['place_longitude'].setValue(place.value.longitude);
  }
}

function showForm() {
 let form = document.getElementById('covidForm');
 let button = document.getElementById('revealForm');

 if (form.className != 'revealed') {
   form.style.visibility = 'visible';
   form.className = 'revealed'
   button.innerHTML = "Cancel"
   button.style.backgroundColor = "#CC3333"; 
 } else {
   form.style.visibility = 'hidden';
   form.className = 'notRevealed';
   button.innerHTML = "Click To Add New Report"
   button.style.backgroundColor = "#4CAF50"
 }
}