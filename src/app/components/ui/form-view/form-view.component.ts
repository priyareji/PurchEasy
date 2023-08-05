import {
	Component,
	OnInit,
	Directive,
	Input,
	AfterViewInit,
	ViewChild,
	ChangeDetectorRef,
	HostBinding,
	Output,
	EventEmitter,
	ContentChild,
	OnDestroy
} from '@angular/core';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MatTabGroup } from '@angular/material/tabs';
import { NavigationEnd, Router } from '@angular/router';
import { accordionY } from '@app/shared/animations/accordion.animate';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { BaseService } from '@app/shared/services/base.service';

@Component({
	selector: 'app-form-view',
	templateUrl: './form-view.component.html',
	styleUrls: ['./form-view.component.scss'],
	animations: [accordionY]
})
export class FormViewComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() popup = false;
	@Input() showHelp: boolean;
	@Input() insightsLoader = false;
	@Input() contentLoader = false;
	@Input() button: {
		caption: string,
		icon?: string,
		svgIcon?: string
	};
	@Input() buttonOptions: Array<{
		key: string,
		value: string
	}> = [];
	@Input() breadCrumbs: Array<any> = [];
	@ViewChild('insights') insights;
	@ContentChild('tab') tabData: MatTabGroup;
	@Output() action = new EventEmitter();
	@Output() helpTriggered = new EventEmitter();
	@ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

	displayBlock = false;
	showInsights = false;
	tabs: any = [];
	menuGroups = [];
	timeOut;
	actualURL = '';
	oldMenu;
	subscribesArr = [];

	constructor(
		public detectDevice: DetectDeviceService,
		private cdref: ChangeDetectorRef,
		public locale: LocaleService,
		private gfService: GlobalFunctionService,
		private router: Router,
		private baseService: BaseService
	) { }

	ngOnInit(): void {
		this.subscribesArr.push(this.detectDevice.resolutionState$.subscribe((device) => {
			if (device.deviceType !== 'desktop' && !([null, undefined].includes(this.showHelp))) {
				this.showHelp = false;
				this.helpTriggered.emit(false);
			}
			if (device.isChanged) {
				if (this.timeOut) {
					clearTimeout(this.timeOut);
				}
				if (this.tabData) {
					this.timeOut = setTimeout(() => {
						this.tabData.realignInkBar();
						this.cdref.detectChanges();
					}, 300);
				}
			}
		}));
		this.setMenuData();
		this.baseService.menuUpdate.subscribe(resp => {
			if (resp) {
				this.setMenuData();
				this.setMenuActive();
			}
		});
		if (!this.popup) {
			this.setMenuActive();
			this.subscribesArr.push(this.router.events.subscribe((event) => {
				if (event instanceof NavigationEnd) {
					this.setMenuActive();
				}
			}));
		}
	}

	setMenuData() {
		if (this.gfService.sessionUser && this.gfService.sessionUser.menuData) {
			if (this.gfService.sessionUser.menuData.menu.length) {
				this.menuGroups = JSON.parse(JSON.stringify(this.gfService.sessionUser.menuData.menu));
			}
		}
	}

	setMenuActive() {
		if (navigator.onLine) {
			this.actualURL = this.router.url.split('?')[0];
			const queryParams = this.router.parseUrl(this.router.url).queryParams;
			for (let i = 0; i < this.menuGroups.length; i++) {
				if (this.menuGroups[i].menuList && this.menuGroups[i].menuList.length) {
					this.menuGroups[i].menuList = this.menuGroups[i].menuList.sort((a, b) => {
						return a.group - b.group;
					});
					let groupNo = 1;
					for (let j = 0; j < this.menuGroups[i].menuList.length; j++) {
						this.menuGroups[i].menuList[j].active = false;
						this.menuGroups[i].isVisible = false;
						if (groupNo !== this.menuGroups[i].menuList[j].group) {
							this.menuGroups[i].menuList[j].groupDivider = true;
							groupNo = this.menuGroups[i].menuList[j].group;
						}
					}
				} else {
					this.menuGroups[i].active = false;
					this.menuGroups[i].isVisible = false;
				}
			}
			let activated = false;
			for (let i = 0; i < this.menuGroups.length; i++) {

				if (this.menuGroups[i].menuList && this.menuGroups[i].menuList.length) {
					for (let j = 0; j < this.menuGroups[i].menuList.length; j++) {
						// if (reset) {
						// }
						if (this.menuGroups[i].menuList[j].link === this.actualURL) {
							if (queryParams && ['Event'].includes(this.menuGroups[i].menuList[j].moduleName)) {
								let key;
								if (this.menuGroups[i].menuList[j].moduleName === 'Event') {
									key = 'eventType';
								}
								if (queryParams[key]) {
									if (queryParams[key] === this.menuGroups[i].menuList[j].queryParams[key]) {
										activated = true;
										this.menuGroups[i].menuList[j].active = true;
										this.menuGroups[i].isVisible = true;
										this.oldMenu = this.menuGroups[i].menuList[j];
										break;
									}
								} else if (!this.menuGroups[i].menuList[j].queryParams || !this.menuGroups[i].menuList[j].queryParams[key]) {
									activated = true;
									this.menuGroups[i].menuList[j].active = true;
									this.menuGroups[i].isVisible = true;
									this.oldMenu = this.menuGroups[i].menuList[j];
									break;
								}
							} else {
								activated = true;
								this.menuGroups[i].menuList[j].active = true;
								this.menuGroups[i].isVisible = true;
								this.oldMenu = this.menuGroups[i].menuList[j];
								break;
							}
						}
						if (activated) {
							break;
						}
					}
				} else if (this.menuGroups[i].link === this.actualURL) {
					activated = true;
					this.menuGroups[i].active = true;
					this.menuGroups[i].isVisible = true;
					this.oldMenu = this.menuGroups[i];
					if (activated) {
						break;
					}
				}
			}
		}
	}

	ngAfterViewInit() {
		if (!([null, undefined].includes(this.showHelp))) {
			this.showInsights = true;
		}
	}


	routeNav(menu) {
		if (navigator.onLine) {
			if (menu.link) {
				const actualURL = this.router.url.split('?')[0];
				// if (this.actualURL === actualURL) {
				// 	menu.active = true;
				// 	this.oldMenu.active = false;
				// 	this.oldMenu = menu;
				// }
				this.gfService.routeNavigation(menu.link, menu.queryParams, null);
			}
		}
	}

	toggleHelp() {
		if (navigator.onLine) {
			// this.showInsights = true;
			this.helpTriggered.emit(!this.showHelp);
			this.displayBlock = this.showHelp;
			this.showHelp = !this.showHelp;
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
			if (this.tabData) {
				this.timeOut = setTimeout(() => {
					this.tabData.realignInkBar();
					this.cdref.detectChanges();
				}, 300);
			}
		}
	}

	actions(actionEl, data = null) {
		if (this.buttonOptions && this.buttonOptions.length) {
			if (data) {
				this.action.emit(data);
			}
		} else {
			if (this.menuTrigger) {
				this.menuTrigger.closeMenu();
			}
			this.action.emit(actionEl);
		}
	}

	ngOnDestroy() {
		if (this.subscribesArr && this.subscribesArr.length) {
			for (const subscribe of this.subscribesArr) {
				subscribe.unsubscribe();
			}
		}
	}
}

@Directive({
	selector: 'form-title'
})
export class FormTitle { }

@Directive({
	selector: 'content-area'
})
export class FormContentArea { }

@Directive({
	selector: 'insights'
})
export class FormInsights {
	@HostBinding('style.display') private display = 'block';
	@HostBinding('style.min-width') private width = '240px';
}
