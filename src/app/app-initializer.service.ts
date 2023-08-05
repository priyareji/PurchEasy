import { Injectable, isDevMode } from '@angular/core';
import Configurations from '../configuration.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocaleService } from './shared/services/locale.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AppInitService {
	configuration = Configurations.configuration;
	sessionUser = null;

	constructor(
		private http: HttpClient,
		private locale: LocaleService,
		private snackBar: MatSnackBar
	) { }

	async preLoad() {

		let canReload = false;
		if (navigator.onLine) {
			const config = await this.loadFile('/configuration.json');
			this.configuration = config.configuration;
			if (this.getCookie('token') && this.sessionUser === null) {
				await this.setSessionUser();
				// await this.getMenuData();
				// await this.getPermissionData();
			}
			let localeContent = localStorage.getItem('languageData');
			if (localeContent) {
				localeContent = JSON.parse(localeContent);
			}
			if (sessionStorage.getItem('locale')) {
				const language = await this.loadFile(`/assets/locale/${sessionStorage.getItem('locale')}.json`);
				localeContent = language.content;
			} else {
				const language = await this.loadFile(`/assets/locale/en.json`);
				localeContent = language.content;
			}
			if (localeContent) {
				this.locale.localeContent = localeContent;
			}
			localStorage.setItem('languageData', JSON.stringify(localeContent));
		} else {
			let localeContent = localStorage.getItem('languageData');
			if (localeContent) {
				localeContent = JSON.parse(localeContent);
				this.locale.localeContent = localeContent;
			}
			canReload = true;
			this.snackBar.open('You are offline', '', {
				duration: 172800000,
				horizontalPosition: 'center',
				verticalPosition: 'top'
			});
		}
		addEventListener('online', async () => {
			// if (canReload) {
			this.snackBar.dismiss();
			if (!isDevMode() && ([null, undefined].includes(this.configuration) || [null, undefined].includes(this.locale))) {
				window.location.reload();
			}
			// }
		});
	}

	private async loadFile(file: string): Promise<any> {
		return this.http.get(file).toPromise();
	}

	private async setSessionUser() {
		try {
			const apiData = {};
			const headers: any = {};
			const response = await this.loadUser(apiData, headers);
			this.sessionUser = response;
			this.sessionUser.name = `${this.sessionUser.profile.firstName}${this.sessionUser.profile.lastName
				? ' ' + this.sessionUser.profile.lastName
				: ''}`;
			this.sessionUser.lastLoginTime = null;
			// this.sessionUser = { name: 'test', userID: 1, firstName: 'test', lastName: 'test' };
		} catch (error) {

		}

	}

	private loadUser(params: any = {}, headers: any = {}): Promise<any> {
		const token = this.getCookie('token');
		if (token) {
			headers.token = token;
		}
		// headers = this.JSONMerge(headers, this.headers);
		const api = this.configuration.API_URL + '' + this.configuration.API_PREFIX + `authentication/usersessiondetails`;
		const options = {
			headers: new HttpHeaders(headers),
			params
		};
		return this.http.get(api, options).toPromise();
	}

	private getCookie(name: string) {
		try {
			const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
			const caLen: number = ca.length;
			const cookieName = `${name}=`;
			let c: string;
			for (let i = 0; i < caLen; i += 1) {
				c = ca[i].replace(/^\s+/g, '');
				if (c.indexOf(cookieName) === 0) {
					const returnData = c.substring(cookieName.length, c.length);
					if (returnData) {
						if (this.isJson(returnData)) {
							return JSON.parse(returnData);
						}
						return returnData;
					}
				}
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	private isJson(item) {
		item = typeof item !== 'string' ? JSON.stringify(item) : item;
		try {
			item = JSON.parse(item);
		} catch (e) {
			// console.error(e);
			return false;
		}

		if (typeof item === 'object' && item !== null) {
			return true;
		}

		return false;
	}
}
