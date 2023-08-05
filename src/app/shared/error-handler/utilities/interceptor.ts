import { Injectable, isDevMode } from '@angular/core';
import {
	HttpErrorResponse,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError, takeUntil, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { ErrorService } from './error.service';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { HandlerService } from './handler';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppInitService } from '@app/app-initializer.service';
import { MatDialog } from '@angular/material/dialog';


@Injectable()
export class Interceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private gfService: GlobalFunctionService,
		private notificationService: NotificationService,
		private errorService: ErrorService,
		private handlerService: HandlerService,
		private locale: LocaleService,
		private appInit: AppInitService,
		private popup: MatDialog
	) {

	}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(request).pipe(
			// retry(1),
			// map((ev) => {
			// 	console.log(ev);
			// 	return ev;
			// }),
			catchError((error) => {
				if (!navigator.onLine) {
					// No Internet connection
					this.notificationService.notify('No Internet Connection');
					console.log(error);
					return throwError(error);
					// throw new Error('offline');
					// this.router.navigate(['/no-network']);
					// return;
				}
				if (error instanceof HttpErrorResponse) {
					if (error.error instanceof ErrorEvent) {
						console.error('Error Event', error);
					} else {
						console.log(`error status : ${error.status} ${error.statusText}`);
						// Server error happened
						console.log(error);
						switch (error.status) {
							case 401: // 422
								if (error.error && ['INVALID_TOKEN', 'TOKEN_EXPIRED', 'SESSION_EXPIRED', 'TOKEN_EXPECTED'].includes(error.error.errorCode)) {
									if (['TOKEN_EXPIRED', 'SESSION_EXPIRED'].includes(error.error.errorCode)) {
										let msg = '';
										if (error.error.errorCode === 'TOKEN_EXPIRED') {
											msg = 'token_is_expired';
										} else {
											msg = 'session_is_expired';
										}
										this.gfService.openSnackBar('SUCCESS', {
											message: this.locale.translate(msg),
											icon: 'check_circle_outline',
											position: 'before'
										});
									}
									this.gfService.globalBS$.next({
										type: 'IS_LOGIN',
										isLogin: false
									});
									this.gfService.isLogin$.next(false);
									this.gfService.deleteCookie('token');
									if (this.popup.openDialogs.length) {
										this.popup.closeAll();
									}
									this.gfService.sessionUser = null;
									this.appInit.sessionUser = null;
									this.router.navigate(['auth/login']);
								}
								break;
						}
					}
					// Http Error
					// Send the error to the server
					this.errorService.log(error);
					// Show notification to the user
					if (isDevMode()) {
						this.notificationService.notify(`${error.status} - ${error.statusText}`);
					}
				}
				return throwError(error);
			}),
			takeUntil(this.handlerService.onTerminateRequest(request))
		);

	}
}
