import { OnInit, OnDestroy, ElementRef } from '@angular/core';
export declare class CountdownTimer implements OnInit, OnDestroy {
    private el;
    start: any;
    end: any;
    zeroTrigger: any;
    timeOnly: any;
    timer: any;
    displayTime: any;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private getTimeDiff(datetime, useAsTimer?);
    private twoDigit(number);
    private stopTimer();
}
