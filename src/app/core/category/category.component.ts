import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { CommunicationService } from '../../utils/comm.service';
import { getCategory } from 'src/app/utils/data.util';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  domain: any = LocalStorageHelper.fetch('domain');
  Categories: any;
  getRequest$;

  constructor(
    private communication: CommunicationService
  ) { }

  ngOnInit() {
    this.Categories = getCategory();
    this.getRequest$ = this.communication.getRequest().subscribe((req) => {
      this.Categories = getCategory();
    });
  }

  url(txt) {
    let NewTxt = txt.replace(new RegExp(' & ', 'g'), '_');
    NewTxt = NewTxt.replace(new RegExp(' ', 'g'), '');
    return NewTxt;
  }

  ngOnDestroy(): void {
    this.getRequest$.unsubscribe();
  }
} 