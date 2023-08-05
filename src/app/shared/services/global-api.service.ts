import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalFunctionService } from './global-function.service';
import { Observable } from 'rxjs';
import { AppInitService } from '@app/app-initializer.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalApiService {
	headers: any = {
		'Content-Type': 'application/json'
	};

	constructor(
		private http: HttpClient,
		private gfService: GlobalFunctionService,
		private appInit: AppInitService
	) { }

	loadFile(uri: string, params: any = {}, headers: any = {}): Observable<any> {
		const options = {
			headers: new HttpHeaders(headers),
			params
		};
		const api = `${this.appInit.configuration.API_URL}${this.appInit.configuration.API_PREFIX}${uri}`;
		return this.http.get(api, options);
	}

	getTermSetList(params: any, headers: any = {}): Observable<any> {
		const token = this.gfService.getCookie('token');
		if (token) {
			headers.token = token;
		}
		headers = this.gfService.JSONMerge(headers, this.headers);
		const options = {
			headers: new HttpHeaders(headers),
			params
		};
		const api = this.appInit.configuration.API_URL + '' + this.appInit.configuration.API_PREFIX + `terms/termset`;
		return this.http.get(api, options);
	}

	getTerm(params: any = {}, headers: any = {}): Observable<any> {
		const token = this.gfService.getCookie('token');
		if (token) {
			headers.token = token;
		}
		headers = this.gfService.JSONMerge(headers, this.headers);
		const api = this.appInit.configuration.API_URL + '' + this.appInit.configuration.API_PREFIX + `terms`;
		const options = {
			headers: new HttpHeaders(headers),
			params
		};
		return this.http.get(api, options);
	}

	getTermDetail(params: any, id: number, headers: any = {}): Observable<any> {
		const token = this.gfService.getCookie('token');
		if (token) {
			headers.token = token;
		}
		headers = this.gfService.JSONMerge(headers, this.headers);
		const options = {
			headers: new HttpHeaders(headers),
			params
		};
		const api = this.appInit.configuration.API_URL + '' + this.appInit.configuration.API_PREFIX + `terms/${id}`;
		return this.http.get(api, options);
	}

	saveTerm(params: any, id: number, headers: any = {}): Observable<any> {
		const token = this.gfService.getCookie('token');
		if (token) {
			headers.token = token;
		}
		headers = this.gfService.JSONMerge(headers, this.headers);
		const api = this.appInit.configuration.API_URL + '' + this.appInit.configuration.API_PREFIX + `terms`;
		const options = {
			headers: new HttpHeaders(headers)
		};
		return this.http.post(api, params, options);
	}
}
