import { Component, OnInit } from '@angular/core';
import { LocalStorageHelper } from "../../utils/local-storage";
import { HttpHelperService } from "../../utils/http-helper.service";
import { TranslateService } from '@ngx-translate/core';
import { CommunicationService } from '../../utils/comm.service';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import * as _moment from 'moment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  feedVersion: any = LocalStorageHelper.fetch('feedVersion');
  FeedLoaded: boolean = false;
  FeedList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  country: any = LocalStorageHelper.fetch('country');
  language: any = LocalStorageHelper.fetch('language');
  currencyCode: any = LocalStorageHelper.fetch('currencyCode');
  domain: any = LocalStorageHelper.fetch('domain');
  token: any = LocalStorageHelper.fetch('token');
  feedRefreshTime: any;
  categoryId: any;
  getRequest$;
  myInterval;

  constructor(
    public translate: TranslateService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private communication: CommunicationService) { }

  ngOnInit() {
    this.feedRefreshTime = LocalStorageHelper.fetch('feedRefreshTime');
    this.LoadFeed();
    this.ToDuration();
    this.getRequest$ = this.communication.getRequest().subscribe((req) => {
      if (req == 'ShowUserArea' || req == 'openLogin') {
        this.feedVersion = LocalStorageHelper.fetch('feedVersion');
        this.country = LocalStorageHelper.fetch('country');
        this.language = LocalStorageHelper.fetch('language');
        this.currencyCode = LocalStorageHelper.fetch('currencyCode');
        this.domain = LocalStorageHelper.fetch('domain');
        this.token = LocalStorageHelper.fetch('token');
        this.ReloadData();
      }
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.ReloadData();
    });
  }

  ReloadData() {
    this.FeedList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    this.FeedLoaded = false;
    this.LoadFeed();
  }

  LoadFeed() {
    if (this.token == null) {
      this.categoryId = this.route.snapshot.params.id;
      this.http.get('AuctionFeed/v1/CategoryAuctionsEveryone/' + this.categoryId + '?domain=' + this.country + '&language=' + this.language).subscribe((resp: any) => {
        this.currencyCode = LocalStorageHelper.fetch('currencyCode');
        this.FeedList = resp;
        this.FeedLoaded = true;
      });
    } else {
      this.categoryId = this.route.snapshot.params.id;
      this.http.post('AuctionFeed/v1/CategoryAuctions/' + this.categoryId, {}).subscribe((resp: any) => {
        this.currencyCode = LocalStorageHelper.fetch('currencyCode');
        this.FeedList = resp;
        this.FeedLoaded = true;
      });
    }
  }

  ToDuration() {
    var x = _moment.duration(this.feedRefreshTime).as('milliseconds');
    this.myInterval = setInterval(() => {
      this.LoadFeed();
    }, x);
  }

  ngOnDestroy(): void {
    this.getRequest$.unsubscribe();
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
  }
}
