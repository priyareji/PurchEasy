import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { publish, refCount } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private _maxAge: number = 0;
	set expire(value: number) {
		this._maxAge = value;
	}

	notificationTimer: any;
	private _notification: Subject<string> = new Subject<string>();
	readonly notification$: Observable<string> = this._notification.asObservable().pipe(
		publish(),
		refCount()
	);

	constructor() { }

	notify(message: string) {
		// console.log(message, this.notificationTimer);
		this._notification.next(message);

		if (this.notificationTimer) {
			clearTimeout(this.notificationTimer);
		}
		// if (!([null, undefined, ''].includes(this._maxAge))) {
		this.notificationTimer = setTimeout(() => this._notification.next(''), this._maxAge);
		// }
	}

	clear() {
		this._notification.next('');
	}
}
