import { Component, HostListener, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
	Router,
	NavigationStart,
	NavigationEnd,
	NavigationCancel,
	NavigationError,
	ActivatedRoute,
	ActivationEnd
} from '@angular/router';
import { GlobalFunctionService } from './shared';
import { DetectDeviceService } from './shared/services/detect-device.service';
import { AppInitService } from './app-initializer.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { LocaleService } from './shared/services/locale.service';
import { CacheService } from './shared/services/cache.service';
import { NotificationService } from './shared/error-handler/notification/notification.service';
import { HandlerService } from './shared/error-handler/utilities/handler';
import { MaterialHeader, Pagination } from './shared/models/common.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material/sidenav';
import { BaseService } from './shared/services/base.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: []
})
export class AppComponent implements OnInit {

	@ViewChild('sidenav') sidenav: MatSidenav;

	isLogin = true;
	onSideNavChange = false;
	isMobile = false;
	loader = false;
	scrollState = false;
	lastUrl: string = '';
	localeChanges = false;
	resolutionTimeout: any = null;
	expire = 2000;
	online = true;

	headers: Array<MaterialHeader>;
	recordData: Array<any> = [];
	totalRecordCount = 0;
	paginationData: Pagination = {
		limit: 10,
		skip: 0
	};
	firstPage = true;
	sideBarState = false;
	currentUser;
	apiData;
	filterData: any = {};
	filterJson = {
		clearAll: false,
		chipData: []
	};
	breadcrumbs = [];
	mode = 'default';

	constructor(
		private gfService: GlobalFunctionService,
		private detectDevice: DetectDeviceService,
		private appInit: AppInitService,
		private router: Router,
		private iconRegistry: MatIconRegistry,
		private el: ElementRef,
		private sanitizer: DomSanitizer,
		private handlerService: HandlerService,
		private cdref: ChangeDetectorRef,
		private baseService: BaseService,
		private activatedRoute: ActivatedRoute,
		public locale: LocaleService,
		private notificationService: NotificationService
	) {
		iconRegistry.addSvgIcon('channels', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/channels.svg'));
		iconRegistry.addSvgIcon('badge', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/badge.svg'));
		iconRegistry.addSvgIcon('reassign', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/reassign.svg'));
		iconRegistry.addSvgIcon('workgroup', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/workgroup.svg'));
		iconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/success.svg'));
		iconRegistry.addSvgIcon('warning', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/warning.svg'));
		iconRegistry.addSvgIcon('learning', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/learning.svg'));
		iconRegistry.addSvgIcon(
			'learning-path',
			sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/learning-path.svg')
		);
		iconRegistry.addSvgIcon('create', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/create.svg'));
		iconRegistry.addSvgIcon(
			'contribution',
			sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/contribution.svg')
		);
		iconRegistry.addSvgIcon(
			'notification',
			sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/notification.svg')
		);
		iconRegistry.addSvgIcon('resource', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/resource.svg'));
		iconRegistry.addSvgIcon('shield', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/shield.svg'));
		iconRegistry.addSvgIcon('role', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/role.svg'));
		iconRegistry.addSvgIcon('like', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/like.svg'));

		iconRegistry.addSvgIcon('video_camera', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/video-camera.svg'));
		iconRegistry.addSvgIcon('audio_headphone', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/audio-headphone.svg'));
		iconRegistry.addSvgIcon('pages', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/pages.svg'));
		iconRegistry.addSvgIcon('external_link', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/external-link.svg'));
		iconRegistry.addSvgIcon('document', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/document.svg'));
		iconRegistry.addSvgIcon('back', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/back.svg'));
		iconRegistry.addSvgIcon('next', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/next.svg'));
		// iconRegistry.addSvgIcon('cap', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/cap.svg'));
		iconRegistry.addSvgIcon('skill', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/skill.svg'));
		iconRegistry.addSvgIcon('bookmark', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/bookmark.svg'));
		iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/delete.svg'));
		iconRegistry.addSvgIcon('moderation', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/moderation.svg'));
		iconRegistry.addSvgIcon('assignment', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/assignment.svg'));
		iconRegistry.addSvgIcon('question_and_answer', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/question-and-answer.svg'));
		iconRegistry.addSvgIcon('course', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/course.svg'));
		iconRegistry.addSvgIcon('events', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/events.svg'));
		iconRegistry.addSvgIcon('knowledge_card', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/knowledge-card.svg'));
		iconRegistry.addSvgIcon('unifi_logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/unifi-logo.svg'));
		iconRegistry.addSvgIcon('comments', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/comments.svg'));
		iconRegistry.addSvgIcon('upload_icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/upload-icon.svg'));
		iconRegistry.addSvgIcon('admin', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/admin.svg'));
		iconRegistry.addSvgIcon('certificate', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/certificate.svg'));
		iconRegistry.addSvgIcon('forward_content', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/forward-content.svg'));
		iconRegistry.addSvgIcon('user-profile', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/user-profile.svg'));
		iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/edit.svg'));
		iconRegistry.addSvgIcon('past-reporting', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/past-reporting.svg'));
		iconRegistry.addSvgIcon('post', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/post.svg'));
		iconRegistry.addSvgIcon('playlist', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/playlist.svg'));
		iconRegistry.addSvgIcon('star-badge', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/star-badge.svg'));
		iconRegistry.addSvgIcon('shield-new', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/shield-new.svg'));
		iconRegistry.addSvgIcon('star-badge-outline', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/star-badge-outline.svg'));
		iconRegistry.addSvgIcon('arrow-down', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/arrow-down.svg'));
		iconRegistry.addSvgIcon('arrow-up', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/arrow-up.svg'));
		iconRegistry.addSvgIcon('youtube', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/youtube.svg'));
		iconRegistry.addSvgIcon('linkedin', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/linkedin.svg'));
		iconRegistry.addSvgIcon('next-arrow', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/next-arrow.svg'));
		iconRegistry.addSvgIcon('forward_outline', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/forward-outline.svg'));
		iconRegistry.addSvgIcon('bookmark_outline', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/bookmark-outline.svg'));
		iconRegistry.addSvgIcon('playlist_plus', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/playlist-plus.svg'));
		iconRegistry.addSvgIcon('drag_and_drop', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/drag-and-drop.svg'));
		iconRegistry.addSvgIcon('copy_url', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/copy-url.svg'));
		iconRegistry.addSvgIcon('image_collection', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/image-collection.svg'));
		iconRegistry.addSvgIcon('tick_mark', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/tick-mark.svg'));
		iconRegistry.addSvgIcon('bility_logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/bility-logo.svg'));
		iconRegistry.addSvgIcon('sad_emoji', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/sad-emoji.svg'));
		iconRegistry.addSvgIcon('bility_logo_tm', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/bility-logo-tm.svg'));
		iconRegistry.addSvgIcon('sorry', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/sorry.svg'));
		iconRegistry.addSvgIcon('oops', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/oops.svg'));
		iconRegistry.addSvgIcon('playlist_small', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/playlist-small.svg'));
		iconRegistry.addSvgIcon('register_learning', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/register-learning.svg'));
		iconRegistry.addSvgIcon('assessment', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/assessment.svg'));
		iconRegistry.addSvgIcon('people', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/people.svg'));
		iconRegistry.addSvgIcon('google_logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/google-logo.svg'));
		iconRegistry.addSvgIcon('engagement', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/engagement.svg'));
		iconRegistry.addSvgIcon('microsoft_logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/microsoft-logo.svg'));
		iconRegistry.addSvgIcon('purcheasy_logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/Purcheasy-logo.svg'));

		// this.CC.clearAllCache(false);
		this.gfService.sessionUser = this.appInit.sessionUser;
		this.gfService.setTitle(this.appInit.configuration.SITE_TITLE);
		this.detectDevice.resolution();
		this.gfService.globalBS$.subscribe((res) => {
			// console.log(res)
			if (res) {
				if (res.type === 'MAIN') {
					this.sideBarState = res.state;
				} else if (res.type === 'BURGER') {
					this.onSideNavChange = res.state;
					if (this.sidenav)
						this.sidenav.toggle();
				} else if (res.type === 'PAGE_LOADER') {
					this.loader = res.loader;
				} else if (res.type === 'IS_LOGIN') {
					this.isLogin = res.isLogin;
				} else if (res.type === 'MODULE_NAME') {
					// this.gfService.moduleName = res.name;
					this.gfService.moduleName$.next(res.name);
				}
			}
		});
		// if (this.gfService.isLogin && location.hash && location.hash.match(/(home | auth)/)) {
		// 	this.gfService.routeNavigation(`home`);
		// }
		this.gfService.globalBS$.next({
			type: 'IS_LOGIN',
			isLogin: this.gfService.isLogin
		});
		this.gfService.isLogin$.next(this.gfService.isLogin);
		router.events.forEach((event) => {
			if (event instanceof NavigationStart) {
				this.handlerService.cancelPendingRequests$.next();
				this.gfService.globalBS$.next(
					{
						type: 'PAGE_LOADER',
						loader: true
					}
				);
				// console.log('NavigationStart');
			}
			if (event instanceof NavigationEnd) {
				this.gfService.globalBS$.next(
					{
						type: 'PAGE_LOADER',
						loader: false
					}
				);
				// const url = router.parseUrl(router.url).root.children['primary'].segments[0].path;
				// if (url === 'setup') {
				// 	this.setupScreen = true;
				// } else {
				// 	this.setupScreen = false;
				// }
				// if (!this.lastUrl || this.lastUrl !== url) {
				// 	const target = this.el.nativeElement.querySelector('#scrollReset');
				// 	if (target != null) {
				// 		target.scrollIntoView({
				// 			behavior: 'instant',
				// 			block: 'end',
				// 			inline: 'nearest'
				// 		});
				// 	}
				// }
				// this.lastUrl = url;
				// this.menuActivated = false;
				// this.gfService.blockHttpCall = true;
				// console.log('NavigationEnd');
				// this.handlerService.cancelPendingRequests$.next();
			}
			if (event instanceof NavigationCancel) {
				this.gfService.globalBS$.next(
					{
						type: 'PAGE_LOADER',
						loader: false
					}
				);
				// console.log('NavigationCancel');
			}
			if (event instanceof NavigationError) {
				console.log('error', event);
				console.log('error ChunkLoadError', event.error.name === 'ChunkLoadError');
				if (event.error && (event.error.name === 'ChunkLoadError' || event.error.message.includes(`'call' of undefined`))) {
					console.log('error under if condition', event);
					window.location.reload();
				}
				this.gfService.globalBS$.next(
					{
						type: 'PAGE_LOADER',
						loader: false
					}
				);
				// console.log('NavigationError');
			}
		});
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map(route => {
				while (route.firstChild) route = route.firstChild
				return route
			}),
			filter(route => route.outlet === 'primary'),
			mergeMap(route => route.data)
		).subscribe((data: any) => {
			if (data) {
				if (data.hasOwnProperty('componentName')) {
					this.gfService.globalBS$.next(
						{
							type: 'MODULE_NAME',
							name: data.componentName
						}
					);
				} else {
					this.gfService.globalBS$.next(
						{
							type: 'MODULE_NAME',
							name: data.moduleName
						}
					);
				}
			}
		});
	}

	ngOnInit() {
		this.checkConnectionStatus();

		this.locale.localeChangeDetect.subscribe(resp => {
			this.localeChanges = resp;
			if (!this.localeChanges) {
				this.cdref.detectChanges();
				this.onSideNavChange = false;
			}
		});
		this.baseService.menuUpdate.subscribe(resp => {
			if (resp) {
				this.sidenav.close();
				// this.getMenuObject();
			}
		});
	}

	ngAfterViewInit() {
		if (this.sidenav) {
			this.sidenav.closedStart.subscribe(resp => {
				this.onSideNavChange = false;
			});
			this.sidenav.openedStart.subscribe(resp => {
				// if (!this.menuActivated) {
				// 	this.setMenuActive();
				// }
			});
		}
	}

	routerNav(menu) {
		if (navigator.onLine) {
			if (menu && menu.link) {
				// this.menuActivated = false;
				this.sidenav.toggle();
				// if (menu.key === 'bookmarks') {
				// 	this.bookmarkDetail();
				// } else {
				// 	if (menu.key === 'userEndorsement' || menu.key === 'skillEndorsement') {
				// 		// this.gfService.blockHttpCall = false;
				// 	}
				// 	this.gfService.routeNavigation(menu.link, menu.queryParams);
				// }
			}
		}
	}


	@HostListener('window:resize', ['$event'])
	onResize() {
		if (this.resolutionTimeout) {
			clearTimeout(this.resolutionTimeout);
		}
		this.resolutionTimeout = setTimeout(() => {
			this.detectDevice.resolution();
		}, 200);
	}

	@HostListener('click', ['$event.target'])
	onClickDOM(event: any) {
		// if (!navigator.cookieEnabled) {
		// 	this.router.navigate([ '/cookie-blocked' ]);
		// }
	}

	@HostListener('window:popstate', ['$event'])
	onPopState(event: any) {
	}

	checkConnectionStatus() {
		addEventListener('offline', () => {
			this.expire = 172800000;
			this.online = false;
			this.notificationService.notify(this.locale.translate('you_are_offline'));
		});
		addEventListener('online', () => {
			this.expire = 2000;
			this.online = true;
			this.notificationService.clear();
		});
	}

	onScroll(event: any) {
		this.gfService.globalS$.next(
			{
				type: 'WINDOW_SCROLL',
				data: event
			}
		);
		if (event.target.scrollTop > 200) {
			this.scrollState = true;
		} else {
			this.scrollState = false;
		}
	}

	goToTop() {
		const target = document.querySelector('#main-container');
		if (target != null) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
				inline: 'start'
			});
		}
	}
}
