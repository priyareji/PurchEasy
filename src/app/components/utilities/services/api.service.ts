import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppInitService } from '@app/app-initializer.service';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	headers: any = {
		'Content-Type': 'application/json'
	};

	constructor(
		private http: HttpClient,
		private gfService: GlobalFunctionService,
		private appInit: AppInitService
	) { }
}
