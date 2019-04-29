import {Injectable} from '@angular/core';

@Injectable()
export class SharedService {
    dataArray: string[] = [];

    insertData(data: string){
        this.dataArray.unshift(data);
    }
}