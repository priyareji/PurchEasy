import { ErrorHandler, Injectable, Injector, NgZone, isDevMode } from '@angular/core';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
import { observable, Observable, Subject } from 'rxjs';

@Injectable()
export class HandlerService implements ErrorHandler {
	cancelPendingRequests$ = new Subject<void>();
	constructor(
		private ngZone: NgZone,
		private injector: Injector,
		private notificationService: NotificationService,
		private errorService: ErrorService
	) { }

	async handleError(error: any) {
		const router = this.injector.get(Router);

		if (!navigator.cookieEnabled) {
			// No Internet connection
			this.ngZone.run(() => router.navigate(['/cookie-blocked']));
			return this.notificationService.notify('Please enable cookies.');
		}

		if (!navigator.onLine && !isDevMode()) {
			// No Internet connection
			// this.ngZone.run(() => router.navigate(['/no-network']));
			// return this.notificationService.notify('No Internet Connection.');
		}

		if (!(error instanceof HttpErrorResponse)) {
			this.errorService.log(error).then((errorWithContextInfo) => {
				// this.ngZone.run(() => router.navigate(['/error'], { queryParams: errorWithContextInfo }));
				if (errorWithContextInfo) {
					if (errorWithContextInfo.name === 'ChunkLoadError') {
						window.location.reload();
					}
				}
				if (isDevMode()) {
					this.notificationService.notify('Something went wrong :(');
				}
			});
		}
		return false;
	}

	public onTerminateRequest(request: HttpRequest<any>): Observable<any> {
		if (request.method === 'GET' && request.responseType === 'text' && request.url.includes('/assets/svg')) {
			return new Observable();
		}
		let canCancel = request.headers.get('cancelable');
		if (request.headers && canCancel === 'N') {
			return new Observable();
		}
		return this.cancelPendingRequests$.asObservable();
	}
}
