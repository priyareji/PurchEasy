import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalFunctionService } from '../services/global-function.service';
import { AppInitService } from '@app/app-initializer.service';

@Injectable({
	providedIn: 'root'
})
export class AuthorisationGuard implements CanActivate, CanActivateChild {

	constructor(private gfService: GlobalFunctionService, private appInit: AppInitService) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if ([null, undefined, ''].includes(this.gfService.sessionUser) && this.appInit.sessionUser) {
			this.gfService.sessionUser = this.appInit.sessionUser;
		}
		const currentUser = this.gfService.sessionUser;
		const accessControl = currentUser.ACCESS_CONTROL;
		let moduleName = next.data.moduleName;
		const permissionCode = next.data.permissionCode;
		if (next.data.hasOwnProperty('componentName')) {
			moduleName = next.data.componentName;
		}
		if (![null, undefined, ''].includes(currentUser)) {
			this.gfService.refreshCookies();
			const role = currentUser.role;
			if (accessControl) {
				if (accessControl[moduleName]) {
					if (!permissionCode) {
						return true;
					}
					if (accessControl[moduleName][permissionCode]) {
						return true;
					}
				}
			}
			// if (['Account', 'ProfileSettings'].includes(moduleName)) {
			// 	return true;
			// }
		}
		return false;
	}

	canActivateChild(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		const currentUser = this.gfService.sessionUser;
		const accessControl = currentUser.ACCESS_CONTROL;
		let moduleName = next.data.moduleName;
		const permissionCode = next.data.permissionCode;
		if (next.data.hasOwnProperty('componentName')) {
			moduleName = next.data.componentName;
		}
		if (![null, undefined, ''].includes(currentUser) && permissionCode) {
			this.gfService.refreshCookies();
			const role = currentUser.role;
			if (accessControl) {
				if (accessControl[moduleName]) {
					if (!permissionCode) {
						return true;
					}
					if (accessControl[moduleName][permissionCode]) {
						return true;
					}
				}
			}
			// if (['Account', 'ProfileSettings'].includes(moduleName)) {
			// 	return true;
			// }
		}
		return false;
	}
}
