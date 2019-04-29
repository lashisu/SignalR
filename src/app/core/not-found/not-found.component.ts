import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageHelper } from "../../utils/local-storage";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate([LocalStorageHelper.fetch('domain') + '/feed']);
  }
}