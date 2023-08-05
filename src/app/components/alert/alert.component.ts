import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { Alert } from './alert.model';
import { AlertService } from './alert.service';
import { AppInitService } from '@app/app-initializer.service';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
	@Input() id: string | null = null;
	@Output() actionEmit: any = new EventEmitter();

	alerts: Array<Alert> = [];
	subscription: Subscription | null = null;
	timeOut: any;

	constructor(
		private alertService: AlertService,
		private appInit: AppInitService,
		private elementRef: ElementRef,
		private renderer2: Renderer2
	) { }

	ngOnInit() {
		const el: HTMLElement = this.elementRef.nativeElement;
		this.renderer2.setStyle(el, 'display', 'none');
		if (this.id) {
			this.subscription = this.alertService.onAlert(this.id).subscribe((alert) => {
				if (
					(Array.isArray(alert) && !alert.length) ||
					(alert.hasOwnProperty('content') && !alert.content.text) ||
					!alert
				) {
					// clear alerts when an empty alert is received
					this.alerts = [];
					return;
				}
				// add alert to array
				const el: HTMLElement = this.elementRef.nativeElement;
				this.renderer2.setStyle(el, 'display', '');
				this.alerts.push(alert);
				// this.autoHide(this.alerts);
				if (this.alerts.length) {
					this.autoHide([alert]);
				} else {
					this.autoHide(this.alerts);
				}
			});
		}
	}

	autoHide(alerts: any) {
		alerts.map((alert: any, index: number) => {
			if (alert.autoHide) {
				let duration = this.appInit.configuration.alertDuration;
				if (alert.duration) {
					duration = alert.duration;
				}
				if (this.timeOut) {
					clearTimeout(this.timeOut);
				}
				this.timeOut = setTimeout(() => {
					this.removeAlert(index);
					this.autoHide(alerts);
				}, duration);
			}
		});
	}

	ngOnDestroy() {
		// unsubscribe to avoid memory leaks
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	removeAlert(index: number) {
		// remove specified alert from array
		this.alerts.splice(index, 1);
		const el: HTMLElement = this.elementRef.nativeElement;
		this.renderer2.setStyle(el, 'display', 'none');
	}

	actionClick(record: any) {
		this.actionEmit.emit(record);
	}

	cssClass(alert: Alert) {
		if (!alert) {
			return null;
		}

		// return css class based on alert type
		switch (alert.type) {
			case 'SUCCESS':
				return 'alert-box alert-success';
			case 'ERROR':
				return 'alert-box alert-danger';
			case 'INFO':
				return 'alert-box alert-info';
			case 'WARNING':
				return 'alert-box alert-warning';
		}
	}
}
