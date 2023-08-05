import { Injectable } from '@angular/core';
import {
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	UrlSegment,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalFunctionService } from '../services/global-function.service';
import { AppInitService } from '@app/app-initializer.service';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanActivateChild, CanLoad {

	oldUrl = '';

	constructor(private gfService: GlobalFunctionService, private appInit: AppInitService) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if ([null, undefined, ''].includes(this.gfService.sessionUser) && this.appInit.sessionUser) {
			this.gfService.sessionUser = this.appInit.sessionUser;
		}
		const currentUser = this.gfService.sessionUser;
		if (this.oldUrl && !navigator.onLine) {
			return false;
		}
		this.oldUrl = next.url.toString();
		const redirectTo = next.queryParamMap.get('redirectTo');
		if (redirectTo) {
			if (redirectTo === 'same') {
				sessionStorage.setItem('redirectTo', state.url.toString().replace('redirectTo=same', ''));
			}
		}
		const crtLoginState = ![null, undefined, ''].includes(currentUser);
		if (next.data && next.data.moduleName && next.data.moduleName === 'Setup') {
			if (currentUser.lastLoginTime) {
				return false;
			}
		}
		if (next.data && next.data.functionID && next.data.functionID.length) {
			let status = false;
			if (currentUser && currentUser.permissions && currentUser.permissions.length) {
				for (const permission of next.data.functionID) {
					if (currentUser.permissions.includes(permission)) {
						status = true;
						break;
					}
				}
			} else {
				status = false;
			}
			if (status) {
				return true;
			} else {
				return false;
			}
		}
		if (crtLoginState) {
			return true;
		}
		// return true;
		this.gfService.routeNavigation('auth/login');
		return false;
	}

	canActivateChild(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if ([null, undefined, ''].includes(this.gfService.sessionUser) && this.appInit.sessionUser) {
			this.gfService.sessionUser = this.appInit.sessionUser;
		}
		const currentUser = this.gfService.sessionUser;
		const mustLogin = next.data.hasOwnProperty('mustLogin') ? next.data.mustLogin : true;
		const authState = next.data.hasOwnProperty('authState') ? next.data.authState : true;
		const crtLoginState = ![null, undefined, ''].includes(currentUser);
		if (crtLoginState || !mustLogin) {
			if (crtLoginState && !authState) {
				this.gfService.routeNavigation('/');
				return false;
			}
			return true;
		}
		this.gfService.routeNavigation('auth/login');
		return false;
		// return true;
	}

	canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
		const currentUser = this.gfService.sessionUser;
		if (![null, undefined, ''].includes(currentUser)) {
			this.gfService.refreshCookies();
			return true;
		}
		return false;
	}
}
