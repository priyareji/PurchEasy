import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlertService, AlertType, Alert } from '../../components/alert';
import { AppInitService } from '@app/app-initializer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '@app/components/snack-bar/snack-bar.component';
import { Common } from './common';
import { Clipboard } from "@angular/cdk/clipboard";
import { FormGroup } from '@angular/forms';
import { SnackBarConfiguration } from '../models/common.model';
import { LocaleService } from './locale.service';
import * as moment from 'moment';

@Injectable()
export class GlobalFunctionService extends Common {

	globalBS$: Subject<{
		type: 'MAIN' | 'BURGER' | 'IS_LOGIN' | 'PAGE_LOADER' | 'MODULE_NAME' | 'FULL_SCREEN' | 'NOTIFICATION_PERMISSION' | 'NOTIFICATION_STATE',
		[x: string]: any
	}> = new Subject();
	globalS$: Subject<{
		type: 'LOAD_TASK' | 'WINDOW_SCROLL',
		[x: string]: any
	}> = new Subject();
	isLogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	sessionUser: any = null;
	sideNaveState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	pageLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	moduleName$: BehaviorSubject<string> = new BehaviorSubject('');
	profilePicture$: BehaviorSubject<string> = new BehaviorSubject('');
	companyLogo$: BehaviorSubject<string> = new BehaviorSubject('');
	lastParentMenu: any = [];

	constructor(
		private location: Location,
		private title: Title,
		private router: Router,
		private alertService: AlertService,
		private snackBar: MatSnackBar,
		private sanitizer: DomSanitizer,
		private componentFactoryResolver: ComponentFactoryResolver,
		private appInit: AppInitService,
		private clipboard: Clipboard,
		private locale: LocaleService
	) {
		super();
	}

	/**
   * @description To set page title using angular predefined setTitle() function
   * @param {string} value title value to replace in title tag.
   * @set It will set the title in browser.
   */
	setTitle(value: string): void {
		let pageTitle = '';
		if (value && value.toString().length) {
			pageTitle = value + ' - ' + this.appInit.configuration.SITE_TITLE;
		} else {
			pageTitle = this.appInit.configuration.SITE_TITLE;
			// this.appInit.configuration.
		}
		this.title.setTitle(pageTitle);
	}

	/**
		 * @description Given values will be modified before sending the data to API.
		 * @param {json} apiValues form values.
		 * @param {json} renderField form build json data.
		 * @set Modified form values to {@link apiValues}
		 */
	fieldValueConstruct(renderField: any, apiValues: any) {
		if (renderField.fieldType === 'date' && ![null, undefined].includes(apiValues[renderField.fieldColumn])) {
			const currentDate = new DatePipe('en-us');
			const final = Date.parse(apiValues[renderField.fieldColumn]);
			if (final !== null) {
				apiValues[renderField.fieldColumn] = final;
			}
		} else if (
			renderField.fieldType === 'imageCrop' &&
			![null, undefined].includes(apiValues[renderField.fieldColumn])
		) {
			if (apiValues[renderField.fieldColumn].hasOwnProperty('croppedFile')) {
				apiValues[renderField.fieldColumn] = apiValues[renderField.fieldColumn].croppedFile;
			}
		} else if (
			renderField.fieldType === 'internationalPhoneNumber' &&
			![null, undefined].includes(apiValues[renderField.fieldColumn])
		) {
			const value = apiValues[renderField.fieldColumn];
			if (value !== null) {
				const finalIntelNumber = { value, country: renderField.additionalMetaData.country };
				apiValues[renderField.fieldColumn] = JSON.stringify(finalIntelNumber);
			}
		} else if (
			renderField.fieldType === 'captcha' &&
			![null, undefined].includes(apiValues[renderField.fieldColumn])
		) {
			Object.keys(apiValues).map((key) => {
				if (key === renderField.fieldColumn) {
					delete apiValues[key];
				}
			});
		} else if (
			renderField.fieldType === 'dropDown' &&
			![null, undefined].includes(apiValues[renderField.fieldColumn])
		) {
			if (
				renderField.isMultiple &&
				renderField.additionalMetaData.showSelectAll &&
				apiValues[renderField.fieldColumn].length
			) {
				apiValues[renderField.fieldColumn].map((data: any, index: number) => {
					if (data === 'selectAll') {
						apiValues[renderField.fieldColumn].splice(index, 1);
					}
				});
			} else {
				if (renderField.additionalMetaData.isNone && !renderField.isRequired && apiValues[renderField.fieldColumn] === 'none') {
					apiValues[renderField.fieldColumn] = null;
				}
			}
		} else if (
			renderField.fieldType === 'textBox' &&
			![null, undefined].includes(apiValues[renderField.fieldColumn])
		) {
			if (renderField.additionalMetaData.capLock) {
				apiValues[renderField.fieldColumn] = apiValues[renderField.fieldColumn].toUpperCase();
			}
			if (renderField.type === 'number') {
				apiValues[renderField.fieldColumn] = Number(apiValues[renderField.fieldColumn]);
			}
		} else if (renderField.fieldType === 'autoComplete') {
			if (renderField.hasOwnProperty('selectedValue') && renderField.selectedValue.length) {
				let value: any[] = [];
				renderField.selectedValue.map((optionsResp: any) => {
					if (typeof optionsResp === 'object') {
						if (optionsResp.hasOwnProperty('key')) {
							const pushData: any = {
								key: optionsResp.key
							};
							// if (optionsResp.hasOwnProperty('weightage')) {
							// 	pushData.progress = optionsResp.progress;
							// 	// pushData.weightage = optionsResp.weightage;
							// 	// if (Array.isArray(renderField.additionalMetaData.maxWeightage)) {
							// 	// 	pushData.weightage = renderField.additionalMetaData.maxWeightage[optionsResp.weightage].key;
							// 	// }
							// }
							value.push(pushData);
							if (value[value.length - 1] && typeof value[value.length - 1] === 'object') {
								if (optionsResp.isDelete) {
									value[value.length - 1].isDelete = optionsResp.isDelete;
								}
								if (optionsResp.isAdd) {
									value[value.length - 1].isAdd = optionsResp.isAdd;
								}
							}
						} else {
							value.push({
								value: optionsResp
							});
						}
					} else {
						value.push(optionsResp);
					}
				});
				if (!renderField.preDefined && !renderField.isMultiple) {
					if (apiValues[renderField.fieldColumn] && typeof apiValues[renderField.fieldColumn] === 'string') {
						value = [
							{
								value: {
									isAdd: true,
									isDelete: false,
									value: apiValues[renderField.fieldColumn]
								}
							}
						];
					}
				}
				apiValues[renderField.fieldColumn] = value;
			}
		}
		if (['textBox', 'textArea', 'dropDown', 'radio', 'date', 'quillEditor'].includes(renderField.fieldType) && [null, undefined].includes(apiValues[renderField.fieldColumn]) && !Array.isArray(apiValues)) {
			apiValues[renderField.fieldColumn] = '';
		}
	}

	/**
   * @description After the validation, values will be modified before sending the data to API.
   * @param {json} apiValues form values as json.
   * @param {json} renderFields form build json data.
   * @see fieldValueConstruct()
   * @return {json} Modified form values.
   */
	fieldSubmitApiValueConstruct(apiValues: any, renderFields: Array<any>) {
		if (renderFields.length) {
			renderFields.map((renderField: any) => {
				this.fieldValueConstruct(renderField, apiValues);
			});
		}
		return apiValues;
	}

	/**
   * @description Resetting the form / control.
   * @param {form} form Form / FormControl.
   */
	resetValue(form: FormGroup): void {
		if (form) {
			form.reset();
			form.markAsTouched();
		}
	}

	/**
   * @description To navigate to preferred page.
   * @param {string} link Router link.
   * @param {object} additionalData Router's additional data like queryParams or etc.
   * @param {string | number} params Router's additional path.
   * @return {boolean} false.
   */
	routeNavigation(link: string, additionalData: NavigationExtras | {} = {}, params: string | number = '') {
		if (![null, undefined, ''].includes(link)) {
			if (Object.keys(additionalData).length && params) {
				let linkData: any = [];
				linkData.push(link);
				linkData = linkData.concat(params);
				this.router.navigate(linkData, additionalData);
			} else if (Object.keys(additionalData).length && !params) {
				this.router.navigate([link], { queryParams: additionalData });
			} else if (params && !Object.keys(additionalData).length) {
				let linkData: any = [];
				linkData.push(link);
				linkData = linkData.concat(params);
				this.router.navigate(linkData);
			} else {
				this.router.navigate([link]);
			}
		}
		return false;
	}

	/**
 * @description Refresh the cookie (token, currentUser).
 */
	refreshCookies(): void {
		// const currentUser = this.getCookie('currentUser');
		const expire = this.appInit.configuration.sessionExpireTime;
		const options = {
			expire
		};
		const token = this.getCookie('token');
		this.setCookie('token', token, options);
		// this.setCookie('currentUser', currentUser, options);
	}

	/**
 * @description Check whether the user is logged in or not. If the user is logged in then the cookie will be refreshed.
 * @see refreshCookies()
 * @returns {boolean} true / false
 */
	get isLogin() {
		const currentUser = this.sessionUser;
		const token = this.getCookie('token');
		if (![null, undefined, ''].includes(currentUser) && ![null, undefined, ''].includes(token)) {
			this.refreshCookies();
			return true;
		}
		return false;
	}

	/**
   * @description Set form control as touched.
   * @param {array} renderFields array of fields.
   * @param {FormGroup} form Form field controls.
   */
	fieldControlMarkAsTouched(renderFields: any, form: FormGroup): void {
		const formGroup: any = form;
		for (const field of renderFields) {
			if (
				formGroup.controls[field.fieldColumn].touched === false &&
				formGroup.controls[field.fieldColumn].status === 'INVALID'
			) {
				formGroup.controls[field.fieldColumn].markAsTouched();
			}
		}
	}

	/**
   * @description Set form control as touched.
   * @param {array} renderFields array of form group field.
   * @param {FormGroup} form Form field controls.
   */
	fieldGroupControlMarkAsTouched(renderFields: any, form: FormGroup): void {
		const formGroup: any = form;
		for (const field of renderFields.fieldGroup) {
			this.fieldControlMarkAsTouched(field.FieldList, formGroup.controls['group_' + field.fieldGroupId]);
		}
	}

	async loadComponent(component: any, container: ViewContainerRef, record: Array<{ variableName: string, value: any }>) {
		if (!Array.isArray(record)) {
			throw new Error('Record must be an array of json');
		} else if ([null, undefined, ''].includes(component)) {
			throw new Error('Component name should not be empty');
		}
		try {
			if (typeof component === 'object') {
				const actualComponent = await component;
				const key = Object.keys(actualComponent)[0];
				component = actualComponent[key];
			}
			const factory = this.componentFactoryResolver.resolveComponentFactory(component);
			// container.clear();
			const ref: ComponentRef<any> = container.createComponent(factory);
			for (const data of record) {
				ref.instance[data.variableName] = data.value;
			}
			ref.changeDetectorRef.detectChanges();
			return ref.instance;
		} catch (error) {
			throw new Error(error);
		}
	}


	dateFormat(date: number, format: string) {
		return new DatePipe('en-US').transform(date, format);
	}

	getUTCOffset(date: Date, type = 'STRING') {
		const pad = (value: number) => {
			return value < 10 ? '0' + value : value;
		};
		const sign = date.getTimezoneOffset() > 0 ? '-' : '+';
		const offset = Math.abs(date.getTimezoneOffset());
		const hours = pad(Math.floor(offset / 60));
		const minutes = pad(offset % 60);
		if (type === 'JSON') {
			return {
				sign,
				hours,
				minutes
			};
		} else {
			return sign + hours + ':' + minutes;
		}
	}

	formErrorHandler(error: any, form: FormGroup) {
		if (error.error.propertyError && error.error.propertyError.length) {
			for (const property of error.error.propertyError) {
				Object.keys(property).map((key) => {
					if (form.controls[key]) {
						form.controls[key].setErrors({
							incorrect: {
								msg: property[key]
							}
						});
					}
				});
			}
		}
	}

	/**
   * @description Trigger alert.
   * @param {json | string} error Form field controls.
   * @param {string} id alert id.
   * @param {string} type type of alert.
   */
	alertHandler(error: any, id: string, options: Alert | AlertType): void {
		let message: string = this.appInit.configuration.MESSAGE.WENT_WRONG;
		if (![null, undefined, ''].includes(error.error)) {
			if (error.error === 'popup_closed_by_user') {
				message = `Access cancelled.`;
			} else if (error.error === 'access_denied') {
				message = `Access denied.`;
			} else if (typeof error.error === 'string') {
				message = error.error;
			} else if (
				![null, undefined, ''].includes(error.error.propertyError) &&
				error.error.propertyError.length
			) {
				const msg: any = Object.values(error.error.propertyError[0])[0] || message;
				message = msg.toString();
			} else if (![null, undefined, ''].includes(error.error.message)) {
				message = error.error.message;
			} else if (![null, undefined, ''].includes(error.error.error)) {
				if (error.error.error !== 'invalid_grant') {
					message = error.error.error;
				}
			}
		} else if (![null, undefined, ''].includes(error.statusText)) {
			message = error.statusText;
		} else if (typeof error === 'string') {
			message = error;
		}
		if (typeof options === 'string') {
			const data: Alert = {
				content: {
					text: message
				},
				alertId: id,
				type: options,
				action: [],
				autoHide: false
			};
			// data.action = [];
			if (options === 'SUCCESS') {
				data.action.push({
					type: 'icon',
					icon: 'done',
					position: 'left',
					emit: false,
					classes: ['status-icon'],
					toolTip: ''
				});
			} else if (options === 'WARNING') {
				data.action.push({
					type: 'icon',
					icon: 'warning',
					position: 'left',
					emit: false,
					classes: ['status-icon'],
					toolTip: ''
				});
			} else if (options === 'ERROR') {
				data.action.push({
					type: 'icon',
					icon: 'clear',
					position: 'left',
					emit: false,
					classes: ['status-icon'],
					toolTip: ''
				});
			}
			options = data;
		}
		this.alertService.alert(options);
	}

	/**
	 * @description Trigger alert.
	 * @param {string} type type of snack bar.
	 * @param {string} message snack message.
	 */
	openSnackBar(type: string, message: any, config: SnackBarConfiguration = { verticalPosition: 'top' }): void {
		if (Object.keys(config).length === 0 || !config.hasOwnProperty('duration')) {
			config.duration = this.appInit.configuration.snackBarDuration;
		}
		const data = { data: { message, type } };
		this.snackBar.openFromComponent(SnackBarComponent, this.JSONMerge(data, config));
	}

	/**
   * @description Clear particular alert.
   * @param {string} id alert id.
   */
	alertClear(id: string): void {
		this.alertService.clear(id);
	}

	embed(url: any): any {
		let returnData;
		let urlFormat: any = this.detectEmbedURL(url);
		if (urlFormat.id) {
			urlFormat.isFormatted = true;
			returnData = this.formatEmbedURL(urlFormat);
		} else {
			urlFormat.isFormatted = false;
			urlFormat.url = url;
			returnData = urlFormat;
		}

		return returnData;
	}


	private detectEmbedURL(url: any): object {
		const urlData = new URL(url);
		let returnValue;
		if (urlData.hostname.indexOf('youtube.com') > -1) {
			returnValue = {
				type: 'youtube',
				id: urlData.search.split('=')[1]
			};
		} else if (urlData.hostname === 'youtu.be') {
			returnValue = {
				type: 'youtube',
				id: urlData.pathname.split('/')[1]
			};
		} else if (urlData.hostname === 'vimeo.com') {
			returnValue = {
				type: 'vimeo',
				id: urlData.pathname.split('/')[1]
			};
		} else {
			returnValue = {
				type: 'embedLink',
				id: null
			};
		}

		return returnValue;
	}

	private formatEmbedURL(urlFormat: any): object {

		if (urlFormat.type === 'youtube') {
			const url: any = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${urlFormat.id}`)
			if (url && Object.keys(url).length) {
				urlFormat.url = url.changingThisBreaksApplicationSecurity;
			} else {
				urlFormat.url = url;
			}
		} else if (urlFormat.type === 'vimeo') {
			const url: any = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${urlFormat.id}`)
			if (url && Object.keys(url).length) {
				urlFormat.url = url.changingThisBreaksApplicationSecurity;
			} else {
				urlFormat.url = url;
			}
		}
		return urlFormat;
	}

	trackByID(index: number, item: any) {
		if (this.hasOwnProperty('key') && item) {
			return item[this['key']];
		}
	}

	elementInViewport(el: HTMLElement) {
		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
		);
	}

	errorHandler(error: any, additionalInfo: {
		alert?:
		{
			id: string,
			options?: Alert | AlertType
		},
		snackBar?: {
			position: string;
			config?: SnackBarConfiguration;
			message?: string;
			icon?: string;
		},
		form?: {
			form: FormGroup;
		}
	}) {
		if (error && additionalInfo) {
			if (error.error && error.error.errorCode === 'SYSTEM_ERROR') {
				error.error = this.locale.translate('sorry_something_went_wrong_try_again')
			}
			if (additionalInfo.alert) {
				if (!additionalInfo.alert.options) {
					additionalInfo.alert.options = 'ERROR';
				}
				this.alertHandler(error, additionalInfo.alert.id, additionalInfo.alert.options);
			} else if (additionalInfo.snackBar) {
				let message: string = this.appInit.configuration.MESSAGE.WENT_WRONG;
				if (![null, undefined, ''].includes(error.error)) {
					if (typeof error.error === 'string') {
						message = error.error;
					} else if (![null, undefined, ''].includes(error.error.message)) {
						message = error.error.message;
					} else if (![null, undefined, ''].includes(error.error.error)) {
						if (error.error.error !== 'invalid_grant') {
							message = error.error.error;
						}
					}
				} else if (![null, undefined, ''].includes(error.statusText)) {
					message = error.statusText;
				} else if (typeof error === 'string') {
					message = error;
				}
				additionalInfo.snackBar['message'] = message;
				additionalInfo.snackBar['icon'] = 'error';
				this.openSnackBar('ERROR', additionalInfo.snackBar);
			}
			if (additionalInfo.form) {
				this.formErrorHandler(error, additionalInfo.form.form);
			}
		}
	}

	get errorImages() {
		return [
			{
				key: 'dummy_1',
				value: 'dummyimg1.png'
			},
			{
				key: 'dummy_2',
				value: 'dummy-img.png'
			},
			{
				key: 'resourceDefault',
				value: 'resource-default-image.jpg'
			},
			{
				key: 'man',
				value: 'man.png'
			},
			{
				key: 'courseThumbnail',
				value: 'course-thumbnail.png'
			},
			{
				key: 'training',
				value: 'training.jpg'
			},
			{
				key: 'certificate',
				value: 'certificate.jpeg'
			},
			{
				key: 'broken_image',
				value: 'broken-image.jpg'
			}
		];
	}

	setErrorImage(event: any, key: string) {
		if (navigator.onLine) {
			if (event.target) {
				const errorImg = this.errorImages.find(items => items.key === key);
				if (errorImg) {
					event.target.src = `assets/img/${errorImg.value}`;
				}
			}
		}
	}

	copyToClipboard(text: string, alertMessage: string = '') {
		if (text) {
			this.clipboard.copy(text);
			if (alertMessage) {
			}
		}
	}

	intervalTimer(callback: any, interval: number) {
		let timerId: number, startTime: any, remaining = 0;
		let state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed
		let pastInterval = 0;

		function pause() {
			if (!([1, 3].includes(state))) return;
			let currentTimer = Date.now() - startTime;
			if (pastInterval < interval) {
				pastInterval = pastInterval + currentTimer;
			} else {
				pastInterval = interval;
			}
			remaining = interval - pastInterval;
			window.clearInterval(timerId);
			state = 2;
		}

		function resume() {
			if (state != 2) return;
			state = 3;
			startTime = Date.now();
			timerId = window.setTimeout(timeoutCallback, remaining);
		}

		function clearInterval() {
			window.clearInterval(timerId);
		}

		function timeoutCallback() {
			if (state != 3) return;
			pastInterval = 0;
			callback();

			timerId = window.setInterval(counter, interval);
			state = 1;
		}

		function counter() {
			startTime = Date.now();
			pastInterval = 0;
			callback();
		}

		startTime = Date.now();
		timerId = window.setInterval(counter, interval);
		state = 1;
		return { pause, resume, clearInterval }
	}

	getTimeDuration(time: string, durationType: 'hour' | 'minutes' | 'seconds' = 'minutes') {
		let splittedTime = time.split(':');
		let hour = 0;
		let minutes = 0;
		let seconds = 0;
		let duration: any = '';

		if (splittedTime.length) {
			hour = parseInt(splittedTime[0]);

			minutes = parseInt(splittedTime[1]);

			if (splittedTime.length === 3) {
				seconds = parseInt(splittedTime[2]);
			}

			if (durationType === 'hour') {
				hour += Math.floor(minutes / 60);
				hour += Math.floor(seconds / 3600);
				if (hour <= 1) {
					duration = `${hour} hour`
				} else {
					duration = `${hour} hours`
				}
			} else if (durationType === 'minutes') {
				minutes += Math.floor(hour * 60);
				minutes += Math.floor(seconds / 60);
				if (minutes <= 1) {
					duration = `${minutes} min`
				} else {
					duration = `${minutes} min`
				}
			} else if (durationType === 'seconds') {
				seconds += Math.floor(hour * 3600);
				seconds += Math.floor(minutes * 60);
				if (seconds <= 1) {
					duration = `${seconds} seconds`
				} else {
					duration = `${seconds} seconds`
				}
			}
		}
		return duration;
	}

	getRangeDate(past: boolean, type: 'days' | 'months' | 'years', duration: number, conditionalDate?: number, fromDate?: Date) {
		let returnData = null;
		if (!fromDate) {
			fromDate = new Date();
		}
		const targetedDate = moment(fromDate).format('YYYY-MM-DD');
		const alteredDate = this.getDateDifference(past, type, duration, fromDate);
		let startDate;
		let endDate;
		if (past) {
			startDate = alteredDate;
			if (conditionalDate) {
				if (alteredDate < conditionalDate) {
					startDate = conditionalDate;
				}
			}
			endDate = moment(targetedDate).endOf('day').valueOf();
		} else {
			startDate = moment(targetedDate).startOf('day').valueOf();
			endDate = alteredDate;
			if (conditionalDate) {
				if (alteredDate > conditionalDate) {
					endDate = conditionalDate;
				}
			}
		}
		if (startDate && endDate) {
			returnData = {
				startDate,
				endDate
			};
		}
		return returnData;
	}
}

interface ComponentData {
	variableName: string;
	value: any;
}
