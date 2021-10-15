
export class CovidReport {
    name: string;
    phoneNumber: string;
    age: number;
    gender: string;
    id: number;
    place: place;
    date: string;
    time: string;

    constructor(name:string, phoneNumber:string, id:number, place:place, date:string, time:string, age:number, gender:string) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.id = id;
        this.place = place;
        this.date = date;
        this.time = time;
        this.age = age;
        this.gender = gender
    }
}

export class place {
    locationName: string;
    longitude: number;
    latitude: number;

    constructor(locationName:string, longitude:number, latitude:number) {
        this.locationName = locationName;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}