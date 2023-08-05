import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { PopupComponent } from '@app/components/popup/popup.component';
import { accordionX } from '@app/shared/animations/accordion.animate';
import { fade } from '@app/shared/animations/side-nav-slide.animate';
import { transform } from '@app/shared/animations/transform.animate';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';

@Component({
	selector: 'app-menu-list',
	templateUrl: './menu-list.component.html',
	styleUrls: ['./menu-list.component.scss'],
	animations: [fade, transform, accordionX]
})
export class MenuListComponent implements OnInit, AfterViewInit {

	@Input() menuItems;
	@Input() sideNavState: boolean;

	crtMenu: any = {};
	subscription;
	moduleName = '';

	constructor(
		private router: Router,
		private gfService: GlobalFunctionService,
		private cdref: ChangeDetectorRef,
		private popup: MatDialog
	) { }

	ngOnInit(): void {
		this.subscription = this.gfService.globalBS$.subscribe(resp => {
			if (resp && resp.type === 'MODULE_NAME') {
				this.moduleName = resp.name;
				// this.setMenuActive(this.menuItems);
				// this.cdref.detectChanges();
			}
		});
	}

	ngAfterViewInit() {
		this.router.events.forEach((event) => {
			if (event instanceof NavigationStart) {
				this.crtMenu = null;
			}
			if (event instanceof NavigationEnd) {
			}
			if (event instanceof NavigationCancel) {
			}
			if (event instanceof NavigationError) {
			}
		});
	}

	trackByFn(index, item) {
		return index; // or item.id
	}

	routeNav(menu, event) {
		if (navigator.onLine) {
			if (
				([null, undefined].includes(menu.childMenu) || !menu.childMenu.length) &&
				![null, undefined, ''].includes(menu.link)
			) {
				this.crtMenu = menu;
				// if (this.sideNavState) {
				// 	const data: any = {
				// 		type: 'MAIN',
				// 		state: !this.sideNavState
				// 	}
				// 	this.gfService.globalBS$.next(data);
				// 	this.sideNavState = !this.sideNavState;
				// }
				if (menu.key === 'bookmarks') {
					this.bookmarkDetail();
				} else {
					this.gfService.routeNavigation(menu.link, menu.queryParams, null);
				}
			}
			if (![null, undefined].includes(menu.childMenu) && menu.childMenu.length) {
				menu.expanded = ![null, undefined].includes(menu.expanded) ? !menu.expanded : true;
			}
		}
	}

	bookmarkDetail() {
		// const dialogRef = this.popup.open(PopupComponent, {
		// 	panelClass: ['custom-panel'],
		// 	autoFocus: false,
		// 	data: {
		// 		action: 'dynamic',
		// 		popup: true,
		// 		component: import('../../modules/resource/bookmarks/bookmarks.component'),
		// 		componentData: []
		// 	},
		// 	disableClose: true,
		// 	maxHeight: '100%',
		// 	maxWidth: '100%',
		// 	height: '100%'
		// });
		// dialogRef.afterClosed().subscribe(async (result) => {
		// });
	}

	setMenuActive(menus) {
		let crtMenu;
		let expandMenuKey = [];
		for (const menu of menus) {
			if (menu.hasOwnProperty('childMenu') && menu.childMenu.length) {
				this.resetChildMenu(menu);
			}
		}
		for (const menu of menus) {
			const expandMenu = [];
			if (!crtMenu) {
				if (menu.key === this.moduleName) {
					crtMenu = menu;
				} else {
					if (menu.hasOwnProperty('childMenu') && menu.childMenu.length) {
						menu.expanded = false;
						if (menu.hasOwnProperty('childActive')) {
							delete menu.childActive;
						}
						expandMenu.push(menu.key);
						crtMenu = this.setActive(menu.childMenu, expandMenu);
						if (crtMenu) {
							this.gfService.lastParentMenu = [menu];
						}
						if (expandMenu.length) {
							expandMenuKey = expandMenu;
						}
					}
				}
			} else {
				break;
			}
		}
		let lastData;
		if (expandMenuKey.length && crtMenu && Object.keys(crtMenu).length) {
			for (const key of expandMenuKey) {
				if (lastData) {
					if (lastData.hasOwnProperty('childMenu') && lastData.childMenu.length) {
						lastData = lastData.childMenu.find(items => items.key === key);
						lastData.expanded = true;
						lastData.childActive = true;
						lastData.childSelected = true;
					}
				} else {
					lastData = menus.find(items => items.key === key);
					lastData.expanded = true;
					lastData.childActive = true;
					lastData.childSelected = true;
				}
			}
		}
		this.crtMenu = crtMenu;
		this.cdref.detectChanges();
	}

	setActive(childMenu, expandMenuKey) {
		let crtMenu;
		for (const menu of childMenu) {
			if (menu.key === this.moduleName) {
				crtMenu = menu;
				// break;
			} else if (menu.hasOwnProperty('childMenu') && menu.childMenu.length) {
				if (crtMenu) {
					this.resetChildMenu(menu);
				} else {
					expandMenuKey.push(menu.key);
					crtMenu = this.setActive(menu.childMenu, expandMenuKey);
				}
			}
		}
		return crtMenu;
	}

	resetChildMenu(menus) {
		if (menus.hasOwnProperty('expanded')) {
			menus.expanded = false;
		}
		if (menus.hasOwnProperty('childActive')) {
			menus.childActive = false;
		}
		if (menus.hasOwnProperty('childSelected')) {
			menus.childSelected = false;
		}
		if (menus.hasOwnProperty('childMenu') && menus.childMenu.length) {
			this.resetChildMenu(menus.childMenu);
		}
	}

	menuStyle(menu): string | void {
		if (menu.level === 1) {
			return '0px';
		}

		// return menu.level * 15 + 'px';
	}
}
