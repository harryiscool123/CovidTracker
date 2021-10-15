/// <reference types="@types/googlemaps" />

export class covidMarker {
    id: string;
    googleMarker: google.maps.Marker;
    reportCount: number;

    constructor(id:string, googleMarker:google.maps.Marker, reportCount:number) {
        this.id = id;
        this.googleMarker = googleMarker;
        this.reportCount = reportCount;

        if (this.reportCount === 0) {
            this.googleMarker.setMap(null);
        }
    }

    incrementReportCount(parentMap:google.maps.Map) {
        this.reportCount++;
        console.log(this.reportCount);
        if (this.reportCount > 0) {
            this.googleMarker.setMap(parentMap);
        }

        let title = (this.reportCount).toString() + " Case(s) Reported";
        this.googleMarker.setTitle(title);
    }

    // called when a report is deleted
    decrementReportCount() {
        this.reportCount--;
        if (this.reportCount === 0) {
            this.googleMarker.setMap(null);
        }

        let title = (this.reportCount).toString() + " case(s) Reported";
        this.googleMarker.setTitle(title);
    }
}