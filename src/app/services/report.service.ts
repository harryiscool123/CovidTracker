import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as model from '../reportClass';
import * as model2 from '../dataInterface';
import report = model.CovidReport;
import dataKey = model2.dataKey;

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reportList: report[];
  ids: number[];
  uniqueNum = 0;

  constructor(private http: HttpClient) { }

  load() {
    return this.http.get<dataKey[]>('https://218.selfip.net/apps/rxUftZQDwG/collections/data/documents')
  }

  add(newReport: report) {
    this.ids = []
    for (let i = 0; i < this.reportList.length; ++i) {
      this.ids.push(this.reportList[i].id);   
    }

    // find a unique id to assign the newly added report
    while (this.ids.indexOf(this.uniqueNum) != -1) {
      ++this.uniqueNum;
    }
    newReport.id = this.uniqueNum;
    this.reportList.push(newReport);
   
    let reportNum = "report" + (this.uniqueNum).toString();
    this.http.post<object>('https://218.selfip.net/apps/rxUftZQDwG/collections/data/documents/', {
      "key": reportNum,
      "data": newReport
    }).subscribe(((data: any)=>{
      console.log(data);
      }));  
    return newReport;
  }

  delete(deletedReport: report) {
    // remove deletedReport from the reportList
    const index = this.reportList.indexOf(deletedReport);
    if (index > -1) {
        this.reportList.splice(index, 1);
        console.log(this.reportList);
    }
    // remove deletedReport from storage API
    let id = "report" + (deletedReport.id).toString();
    this.http.delete('https://218.selfip.net/apps/rxUftZQDwG/collections/data/documents/' + id + '/').subscribe();
  }

   /*
   / Sort Methods
  */
  sortByName() {
    function compare(a:report, b:report) {
      if(a.place.locationName < b.place.locationName) { return -1; }
      if(a.place.locationName > b.place.locationName) { return 1; }
      return 0;
    }
    this.reportList.sort(compare);
    console.log(this.reportList);
  }
  
  sortByPersonReported() {
    function compare(a:report, b:report) {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    }
    this.reportList.sort(compare);
    console.log(this.reportList);
  }

  sortByNewest() {
    function compare(a:report, b:report) {
      let dateA = Date.parse((a.date).substring(4, 24))
      let dateB = Date.parse((b.date).substring(4, 24))
      return dateB - dateA
    }
    this.reportList.sort(compare);
    console.log(this.reportList);
  }

  sortByOldest() {
    function compare(a:report, b:report) {
      let dateA = Date.parse((a.date).substring(4, 24))
      let dateB = Date.parse((b.date).substring(4, 24))
      return dateA - dateB
    }
    this.reportList.sort(compare);
    console.log(this.reportList);
  }
}
