import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as model from '../reportClass';
import report = model.CovidReport;

@Component({
  selector: 'tr[app-report]',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  @Input() report_input: report;
  @Output() delete = new EventEmitter();
  @Output() seeMore = new EventEmitter();

  constructor() { }

  onDelete(evt: Event) {
    console.log("deleting report");
    console.log(evt);
    this.delete.emit(this.report_input);
  }

  onSeeMore(evt: Event) {
    console.log("Displaying extra details");
    this.seeMore.emit(this.report_input);
  }
}