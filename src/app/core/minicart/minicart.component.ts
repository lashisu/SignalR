import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-minicart',
  templateUrl: './minicart.component.html',
  styleUrls: ['./minicart.component.scss']
})
export class MinicartComponent implements OnInit {
  domain: any = LocalStorageHelper.fetch('domain');
  selected = new FormControl(0);

  constructor() { }
  ngOnInit() {

  }
}
