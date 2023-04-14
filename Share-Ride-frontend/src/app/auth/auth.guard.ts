import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";

import { UserService } from "../services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private userService: UserService,
		private router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
		var isAuthenticated = this.userService.isAuthenticated.value;
		if (!isAuthenticated) {
			this.router.navigate(['/auth']);
		}
		return isAuthenticated;
	}
}
