import { Component, OnInit, Input, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { onSideNavChange } from '@app/shared/animations/side-nav-slide.animate';
import { BaseService } from '@app/shared/services/base.service';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	animations: [onSideNavChange]
})
export class SidebarComponent implements OnInit {
	@Input() sidenav: MatSidenav;
	@Input() sideNavState = false;
	isMobile = false;
	moduleName;
	mouseOnHost = false;
	menuItems: any = [
		{
			key: 'categories',
			title: this.locale.translate('categories'),
			link: '/product-category',
			order: 1,
			svgIcon: 'assessment',
			level: 1,
			isVisible: true,
			moduleName: 'ProductCategory'
		},
		{
			key: 'products',
			title: this.locale.translate('products'),
			link: '/products',
			order: 2,
			svgIcon: 'resource',
			level: 1,
			isVisible: true,
			moduleName: 'Products',
			queryParams: {
				// vendorID: '13',
				// tab: 'skus'
			},
		},
		{
			key: 'customers',
			title: this.locale.translate('customers'),
			link: '/customer',
			order: 3,
			svgIcon: 'people',
			level: 1,
			isVisible: true,
			moduleName: 'Customer'
		},
		{
			key: 'vendors',
			title: this.locale.translate('vendors'),
			link: '/vendor',
			order: 4,
			svgIcon: 'past-reporting',
			level: 1,
			isVisible: true,
			moduleName: 'Vendor',
			// queryParams: {
			// 	tab: 'for_me'
			// },
		},
		{
			key: 'masterList',
			title: this.locale.translate('list'),
			link: '/list',
			order: 5,
			svgIcon: 'assessment',
			level: 1,
			isVisible: true,
			moduleName: 'Master',
			// queryParams: {
			// 	tab: 'for_me'
			// },
		},
		{
			key: 'attributesManagement',
			title: this.locale.translate('attributes'),
			link: '/attributes',
			order: 6,
			svgIcon: 'assessment',
			level: 1,
			isVisible: true,
			moduleName: 'AttributesManagement',
			// queryParams: {
			// 	tab: 'for_me'
			// },
		},
		// {
		// 	key: 'courses',
		// 	title: this.locale.translate('courses'),
		// 	link: '/course',
		// 	order: 3,
		// 	svgIcon: 'course',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'Course',
		// 	queryParams: {
		// 		tab: 'for_me'
		// 	}
		// },
		// {
		// 	key: 'internalEvent',
		// 	title: this.locale.translate('events'),
		// 	link: '/event',
		// 	order: 4,
		// 	icon: 'event',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'Event',
		// 	queryParams: {
		// 		tab: 'all',
		// 		eventType: 'internal'
		// 	}
		// },
		// {
		// 	key: 'question',
		// 	title: this.locale.translate('answers'),
		// 	link: '/questions',
		// 	order: 5,
		// 	svgIcon: 'question_and_answer',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'Questions',
		// 	queryParams: {
		// 		tab: 'for_me'
		// 	}
		// },
		// // {
		// // 	key: 'event',
		// // 	title: this.locale.translate('event'),
		// // 	link: '',
		// // 	order: 5,
		// // 	svgIcon: 'events',
		// // 	level: 1,
		// // 	isVisible: true,
		// // 	moduleName: 'event'
		// // },
		// {
		// 	key: 'playlist',
		// 	title: this.locale.translate('playlists'),
		// 	link: '/playlist',
		// 	order: 6,
		// 	svgIcon: 'playlist',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'Playlist',
		// 	queryParams: {
		// 		tab: 'for_me'
		// 	}
		// },
		// {
		// 	key: 'assignments',
		// 	title: this.locale.translate('assignments'),
		// 	link: 'assignment',
		// 	order: 5,
		// 	svgIcon: 'assignment',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'assignment'
		// },
		// {
		// 	key: 'leaderboard',
		// 	title: this.locale.translate('people'),
		// 	link: '/leaderboard/list',
		// 	order: 7,
		// 	icon: 'account_circle',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'LeaderBoard'
		// },
		// {
		// 	key: 'bookmarks',
		// 	title: this.locale.translate('bookmarks'),
		// 	link: 'bookmark',
		// 	order: 8,
		// 	svgIcon: 'bookmark',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'Bookmarks'
		// },
		// // {
		// // 	key: 'trendAnalytics',
		// // 	title: this.locale.translate('learning'),
		// // 	link: '/analytics/learning',
		// // 	order: 9,
		// // 	icon: 'analytics',
		// // 	level: 1,
		// // 	isVisible: true,
		// // 	moduleName: 'Analytics'
		// // },
		// {
		// 	key: 'functionalRoles',
		// 	title: this.locale.translate('roles_and_settings'),
		// 	link: '/functional-roles',
		// 	order: 10,
		// 	icon: 'admin_panel_settings',
		// 	level: 1,
		// 	isVisible: true,
		// 	moduleName: 'FunctionalRoles'
		// }
	];

	constructor(
		private gfService: GlobalFunctionService,
		private detectDeviceService: DetectDeviceService,
		private locale: LocaleService,
		private cdref: ChangeDetectorRef,
		private baseService: BaseService
	) { }

	ngOnInit(): void {
		// this.gfService.loginState.subscribe(resp => {
		// 	if (resp) {
		// 		this.getMenuObject();
		// 	} else {
		// 		this.menuItems = [];
		// 	}
		// });
		// this.baseService.menuUpdate.subscribe(resp => {
		// 	if (resp) {
		// 		this.getMenuObject();
		// 	}
		// });
		this.detectDeviceService.resolutionState$.subscribe((resp) => {
			this.isMobile = resp.deviceType === 'mobile';
			// this.moduleName = this.gfService.moduleName;
			if (!this.isMobile && !['Homee'].includes(this.moduleName)) {
				this.sideNavState = true;
			} else if (!this.mouseOnHost) {
				this.sideNavState = false;
			}
		});
		this.gfService.globalBS$.subscribe((resp) => {
			if (resp && resp.type === 'MODULE_NAME') {
				this.moduleName = resp.name;
				if (this.detectDeviceService.resolutionState$.value.deviceType !== 'mobile' && !['Homee'].includes(this.moduleName)) {
					this.sideNavState = true;
				} else if (!this.mouseOnHost) {
					this.sideNavState = false;
				}
			}
		});
		if (!this.isMobile && !['Homee'].includes(this.moduleName)) {
			this.sideNavState = true;
		} else if (!this.mouseOnHost) {
			this.sideNavState = false;
		}
	}

	getMenuObject() {
		if (this.gfService.sessionUser && this.gfService.sessionUser.menuData) {
			if (this.gfService.sessionUser.menuData.hoverMenu.length) {
				const menuItems = JSON.parse(JSON.stringify(this.gfService.sessionUser.menuData.hoverMenu));
				this.menuItems = menuItems.filter(items => {
					if (!items.hasOwnProperty('isHover') || items.isHover) {
						if (items.refMenu && items.menuList && items.menuList.length) {
							const refMenu = items.menuList.find(innerItems => innerItems.key === items.refMenu);
							if (refMenu) {
								items.moduleName = refMenu.moduleName;
								items.link = refMenu.link;
								items.key = refMenu.key;
								items.queryParams = refMenu.queryParams;
							}
						}
						items.isVisible = true;
						return items;
					}
				});
				this.cdref.detectChanges();
			}
		}
	}

	onSidenavToggle() {
		const data: any = {
			type: 'MAIN',
			state: !this.sideNavState
		}
		this.gfService.globalBS$.next(data);
		this.sideNavState = !this.sideNavState;
	}

	@HostListener('mouseover', ['$event.target'])
	onMouseOver(event) {
		if (!this.isMobile && !['Homee'].includes(this.moduleName)) {
			this.sideNavState = true;
		}
		this.mouseOnHost = true;
	}

	@HostListener('mouseleave', ['$event.target'])
	onMouseLeave(event) {
		return
		if (!this.isMobile && !['Homee'].includes(this.moduleName)) {
			this.sideNavState = false;
		}
		this.mouseOnHost = false;
	}
}
