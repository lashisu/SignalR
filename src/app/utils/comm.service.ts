import { Subject } from "rxjs";
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class CommunicationService {

    private subject = new Subject<any>();
    private onCountryLoad = new Subject<any>();

    constructor() { }

    sendRequest(message: string) {
        this.subject.next(message);
    }

    getRequest(): Observable<any> {
        return this.subject.asObservable();
    }

    clearMessage() {
        this.subject.next();
    }

    sendNotificationOnCountryLoad() {
        this.onCountryLoad.next();
    }

    onCountryLoadRCompleted() {
        return this.onCountryLoad.asObservable();
    }
}