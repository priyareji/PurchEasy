import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalFunctionService } from './global-function.service';

const MOBILE_MAX_WIDTH = 425;
const MOBILE_MIN_HEIGHT = 600;
const TABLET_MAX_WIDTH = 1024;
const TABLET_MIN_HEIGHT = 600;

interface ScreenState {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	xs: boolean;
	sm: boolean;
	md: boolean;
	lg: boolean;
	xl: boolean;
	deviceType: 'desktop' | 'tablet' | 'mobile' | null;
	orientation: 'portrait' | 'landscape' | null;
	isChanged: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class DetectDeviceService {

	resolutionState$: BehaviorSubject<ScreenState> = new BehaviorSubject<ScreenState>({
		isMobile: false,
		isTablet: false,
		isDesktop: false,
		xs: false,
		sm: false,
		md: false,
		lg: false,
		xl: false,
		deviceType: null,
		orientation: null,
		isChanged: false
	});
	devicePlatforms = [
		{ name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
		{ name: 'Windows', value: 'Win', version: 'NT' },
		{ name: 'Linux', value: 'Linux', version: 'rv' },
		{ name: 'Macintosh', value: 'Mac', version: 'OS X' },
		{ name: 'Kindle', value: 'Silk', version: 'Silk' },
		{ name: 'Android', value: 'Android', version: 'Android' },
		{ name: 'iPhone', value: 'iPhone', version: 'OS' },
		{ name: 'PlayBook', value: 'PlayBook', version: 'OS' },
		{ name: 'BlackBerry', value: 'BlackBerry', version: '/' },
		{ name: 'Palm', value: 'Palm', version: 'PalmOS' }
	];
	browserList = [
		{ searchKey: 'Firefox/', value: 'Mozilla Firefox', key: 'MF' },
		{ searchKey: 'Safari/', value: 'Safari', key: 'SAFARI' },
		{ searchKey: 'Chrome/', value: 'Google Chrome', key: 'CHROME' },
		{ searchKey: 'Edg/', value: 'Microsoft Edge', key: 'EDGE' },
		{ searchKey: 'EdgA/', value: 'Microsoft Edge', key: 'EDGE' },
		{ searchKey: 'MSIE/', value: 'Internet Explorer', key: 'IE' },
		{ searchKey: 'Trident/', value: 'Internet Explorer', key: 'IE' },
		{ searchKey: 'OPR/', value: 'Opera', key: 'OPERA' },
	];
	fingerPrint: any;
	deviceType: 'desktop' | 'tablet' | 'mobile' | null = null;
	isMobile = false;
	isDesktop = false;
	isTablet = false;
	previousData: any;

	constructor(
		private gfService: GlobalFunctionService
	) {
		this.getFingerPrint();
		this.deviceType = this.getDeviceType;
		// if (this.deviceType === 'desktop') {
		// 	this.isDesktop = true;
		// } else if (this.deviceType === 'mobile') {this.fingerPrint
		// }
	}

	resolution(): ScreenState {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		// const isMobile = (windowWidth <= MOBILE_MAX_WIDTH || windowHeight <= MOBILE_MIN_HEIGHT);
		// const isTablet = ((windowWidth <= TABLET_MAX_WIDTH && windowWidth > MOBILE_MAX_WIDTH) ||
		//   (windowHeight <= TABLET_MIN_HEIGHT && windowHeight > MOBILE_MIN_HEIGHT));

		const isMobile = windowWidth <= MOBILE_MAX_WIDTH;
		const isTablet = windowWidth <= TABLET_MAX_WIDTH && windowWidth > MOBILE_MAX_WIDTH;
		const isDesktop = !isMobile && !isTablet;

		let xs = false;
		let sm = false;
		let md = false;
		let lg = false;
		let xl = false;
		if (windowWidth >= 0 && windowWidth <= 599.9) {
			xs = true;
		}
		if (windowWidth >= 600 && windowWidth <= 959.9) {
			sm = true;
		}
		if (windowWidth >= 960 && windowWidth <= 1279.9) {
			md = true;
		}
		if (windowWidth >= 1280 && windowWidth <= 1919.9) {
			lg = true;
		}
		if (windowWidth >= 1920 && windowWidth <= 4999.9) {
			xl = true;
		}
		let orientation: any = '';
		if (window.matchMedia("(orientation: portrait)").matches) {
			orientation = 'portrait';
		} else {
			orientation = 'landscape';
		}
		let deviceType = this.deviceType;
		if (isDevMode()) {
			if (isMobile) {
				deviceType = 'mobile';
			} else if (isTablet) {
				deviceType = 'tablet';
			} else if (isDesktop) {
				deviceType = 'desktop';
			}
		}
		const data: any = {
			isMobile,
			isTablet,
			isDesktop,
			xs,
			sm,
			md,
			lg,
			xl,
			deviceType,
			orientation,
			isChanged: false
		};

		if (this.previousData) {
			for (const key in data) {
				if (data[key] !== this.previousData[key] && key !== 'isChanged') {
					data.isChanged = true;
				}
			}
		}

		this.resolutionState$.next(data);

		this.previousData = data;

		return data;
	}

	getFingerPrint() {
		if (!this.fingerPrint) {
			const platformDetails = this.getDeviceDetails(navigator.userAgent, this.devicePlatforms);
			const browserDetails = this.getBrowserDetails();
			const deviceDetails = this.gfService.JSONMerge(platformDetails, browserDetails);
			const browserSpecDetails = {
				selectedLanguage: navigator.language,
				theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
				userAgent: navigator.userAgent
			};
			this.fingerPrint = this.gfService.JSONMerge(deviceDetails, browserSpecDetails);

		}
		return this.fingerPrint;
	}

	private getBrowserDetails() {
		const browserInfo = navigator.userAgent;
		let browserName = 'unknown';
		let browserKey = 'unknown';
		let browserVersion = '0';
		for (let j = 0; j < this.browserList.length; j++) {
			if (browserInfo.includes(this.browserList[j].searchKey) || navigator.userAgent.indexOf('Opera') !== -1) {
				browserName = this.browserList[j].value;
				let startIndex = browserInfo.indexOf(this.browserList[j].searchKey);
				if (startIndex !== -1) {
					browserVersion = browserInfo.substr((startIndex + this.browserList[j].searchKey.length), 4);
				}

			}
		}
		return { browserKey, browserName, browserVersion };
	}

	private getDeviceDetails(deviceData: string, devicePlatforms: any) {
		let i = 0,
			regex,
			match;

		const deviceType = this.getDeviceType;
		const data = { os: 'unknown', deviceType };
		for (i = 0; i < devicePlatforms.length; i += 1) {
			regex = new RegExp(devicePlatforms[i].value, 'i');
			match = regex.test(deviceData);
			if (match) {
				data.os = devicePlatforms[i].name;
			}
		}
		return data;
	}

	private get getDeviceType() {
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return 'tablet';
		}
		if (
			/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
				ua
			)
		) {
			return 'mobile';
		}
		return 'desktop';
	}


}
