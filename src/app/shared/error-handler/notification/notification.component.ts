import { Component, OnInit, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
	selector: 'app-error-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnChanges {

	@Input() expire: number = 0;

	notification: string = '';
	showNotification: boolean = false;
	constructor(
		public notificationService: NotificationService,
		private cd: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.notificationService
			.notification$
			.subscribe((message) => {
				this.notification = message;
				if (!([null, undefined, ''].includes(message))) {
					this.showNotification = true;
				} else {
					this.showNotification = false;
				}
				this.cd.detectChanges();
			});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.hasOwnProperty('expire') && !([null, undefined, ''].includes(changes.expire.currentValue))) {
			clearTimeout(this.notificationService.notificationTimer);
			this.notificationService.expire = changes.expire.currentValue;
		}
	}

	clearNotice() {
		if (this.notificationService.notificationTimer) {
			clearTimeout(this.notificationService.notificationTimer);
		}
		this.showNotification = false;
		this.cd.detectChanges();
	}

}
