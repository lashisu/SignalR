import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LocalStorageHelper } from "../../utils/local-storage";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (
      LocalStorageHelper.fetch('token') != null && 
      LocalStorageHelper.fetch('userName') != null
    ) {
      return true;
    } else {
      this.router.navigate([LocalStorageHelper.fetch('domain') + '/feed']);
      return false;
    }
}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (
        LocalStorageHelper.fetch('token') != null && 
        LocalStorageHelper.fetch('userName') != null
      ) {
        return true;
      } else {
        this.router.navigate([LocalStorageHelper.fetch('domain') + '/feed']);
        return false;
      }
  }
}
