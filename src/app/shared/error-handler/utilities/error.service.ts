import { Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ErrorService {

	constructor(
		private injector: Injector,
	) {
	}

	log(error: any) {
		// Log the error to the console
		console.error(error);
		// Send error to server
		const errorToSend = this.addContextInfo(error);
		return FakeHttpService.post(errorToSend);
	}

	addContextInfo(error: any) {
		// You can include context details here (usually coming from other services: UserService...)
		const name = error.name || null;
		const appId = 'Angular_12';
		const user = 'System';
		const time = new Date().getTime();
		const id = `${appId}-${user}-${time}`;
		const location = this.injector.get(LocationStrategy);
		const url = location instanceof PathLocationStrategy ? location.path() : '';
		const status = error.status || null;
		const message = error.message || error.toString();
		const stack = error instanceof HttpErrorResponse ? null : (error);

		const errorWithContext = { name, appId, user, time, id, url, status, message, stack };
		return errorWithContext;
	}

}

class FakeHttpService {
	static async post(error: any): Promise<any> {
		return await error;
	}
}
