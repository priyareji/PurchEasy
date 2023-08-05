import { Component, OnInit, Input, ContentChild, TemplateRef, ViewChild, ChangeDetectorRef, OnDestroy, Renderer2, ElementRef, SimpleChanges } from '@angular/core';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';
import { SliderConfig } from '../utilities/models/slider-model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnDestroy {

	@Input() slides: any = [];
	@Input() options: SliderConfig = {};

	@ViewChild('slider') slider!: CarouselComponent;
	@ViewChild('slideContainer') slideContainer!: ElementRef;
	@ContentChild('template') template!: TemplateRef<any>;

	defaultOptions = {
		items: 2,
		slideBy: 'page',
		dragEndSpeed: 1,
		loop: false,
		dots: true,
		nav: true,
		navText: ['<div class="prev"></div>', '<div class="next"></div>'],
		stagePadding: 0,
		touchDrag: true,
		skip_validateItems: true,
		responsive: {
			0: {
				items: 1
			},
			740: {
				items: 2
			}
		},
		margin: 10
	};

	initialPos = 0;
	endPos = 0;
	rawOptions: SliderConfig = {};
	canLoad = false;
	dragIndex = 0;
	timeOut: any;
	subscribe: Subscription | null = null;

	constructor(
		private detectDevice: DetectDeviceService,
		private renderer2: Renderer2,
		private cdref: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.subscribe = this.detectDevice.resolutionState$.subscribe((device) => {
			if (this.slider && device.isChanged) {
				this.dragIndex = 0;
				if (device.deviceType === 'desktop') {
					this.options.nav = this.rawOptions.nav;
					this.options.navText = this.rawOptions.navText;
					this.options.stagePadding = this.rawOptions.stagePadding;
				} else {
					if (this.options.mobileStagePadding) {
						this.options.stagePadding = this.options.mobileStagePadding;
					}
					this.options.nav = false;
					delete this.options.navText;
				}
				if (this.timeOut) {
					clearTimeout(this.timeOut);
				}
				this.timeOut = setTimeout(() => {
					this.slider.ngAfterContentInit();
				}, 800);
			}
		});
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes) {
			if (changes.hasOwnProperty('options')) {
				if (!this.options.responsive || !Object.keys(this.options.responsive).length) {
					this.options.responsive = {
						0: {
							items: 1
						},
						740: {
							items: this.options.items
						}
					};
				}
				this.options = Object.assign(this.defaultOptions, this.options);
				if (this.options.touchDrag || !this.options.hasOwnProperty('touchDrag')) {
					if (
						!this.options.center &&
						this.options.dotsEach !== false &&
						!this.options.autoWidth &&
						!this.options.dragEndSpeed
					) {
						this.options.dragEndSpeed = 1;
					}
				}
			}
		}
		this.rawOptions = Object.assign({}, this.options);
		const device = this.detectDevice.resolutionState$.value;
		if (device.deviceType !== 'desktop') {
			if (this.options.mobileStagePadding) {
				this.options.stagePadding = this.options.mobileStagePadding;
			}
			this.options.nav = false;
			delete this.options.navText;
		}
	}

	ngAfterViewInit() {
		this.canLoad = true;
		this.cdref.detectChanges();
	}

	dragging(event: any, data: any) {
		if (event.dragging) {
			this.renderer2.setStyle(this.slideContainer.nativeElement, 'pointer-events', 'none');
		} else {
			this.renderer2.setStyle(this.slideContainer.nativeElement, 'pointer-events', 'all');
		}
		if (!this.options.center && this.options.dotsEach !== false && !this.options.autoWidth) {
			const pages = data['navigationService']['_pages'];
			if (event.dragging) {
				this.initialPos = event.data.startPosition;
			} else {

				if (this.options.startPosition) {
					this.dragIndex = event.data.startPosition;
					this.options.startPosition = 0;
				}
				if (this.initialPos < this.endPos) {
					this.dragIndex = this.dragIndex + 1;
					if (pages[this.dragIndex]) {
						data.to(`owl-slide-${pages[this.dragIndex].start}`);
					} else {
						this.dragIndex = 0;
						data.to(`owl-slide-${pages[this.dragIndex].start}`);
					}
				} else if (this.initialPos !== this.endPos) {
					this.dragIndex = this.dragIndex - 1;
					data.to(`owl-slide-${pages[this.dragIndex].start}`);
				}
			}
		}

		// if (!this.options.center && this.options.dotsEach !== false && !this.options.autoWidth) {
		// 	if (!event.dragging) {
		// 		// console.log(event.data.startPosition, this.initialPos, pages);
		// 		const index = pages[this.dragIndex + 1];
		// 		// if (this.initialPos === this.endPos && this.endPos > 1) {
		// 		// 	if (this.options.loop) {
		// 		// 		data.to(`owl-slide-0`);
		// 		// 		this.dragIndex = 0;
		// 		// 	}
		// 		// 	return;
		// 		// }

		// 		// if (this.initialPos < this.endPos) {
		// 		// 	data.to(`owl-slide-${index.end}`);
		// 		// 	// data.current(this.initialPos);
		// 		// 	// this.slider.next();
		// 		// 	// data.next();
		// 		// 	this.dragIndex += 1;
		// 		// } else {
		// 		// 	if (this.endPos !== 0) {
		// 		// 		// this.slider.prev();
		// 		// 		// data.current(this.initialPos);
		// 		// 		// data.prev();
		// 		// 		data.to(`owl-slide-${pages[this.dragIndex - 1].start}`);
		// 		// 		this.dragIndex -= 1;
		// 		// 	} else if (this.options.loop) {

		// 		// 	}
		// 		// }
		// 		if (this.initialPos === this.endPos && this.endPos > 1) {
		// 			if (this.options.loop) {
		// 				data.to(`owl-slide-0`);
		// 				this.dragIndex = 0;
		// 			}
		// 			return;
		// 		}
		// 		if (this.initialPos === 0 && this.endPos === 0) {
		// 			if (this.options.loop) {
		// 				data.to(`owl-slide-${pages[pages.length - 1].start}`);
		// 				this.dragIndex = pages.length - 1;
		// 			}
		// 			return;
		// 		}
		// 		// forward
		// 		if (event.data.startPosition >= this.initialPos) {
		// 			// console.log(pages, this.dragIndex);
		// 			if (index) {
		// 				data.to(`owl-slide-${index.start}`);
		// 			} else {
		// 				data.to(`owl-slide-0`);
		// 			}
		// 			this.dragIndex += 1;
		// 		} else {
		// 			// backward
		// 			if (pages[this.dragIndex - 1]) {
		// 				data.to(`owl-slide-${pages[this.dragIndex - 1].start}`);
		// 			} else {
		// 				data.to(`owl-slide-${pages[0].start}`);
		// 			}
		// 			this.dragIndex -= 1;
		// 		}
		// 		// if (index) {
		// 		// 	data.to(`owl-slide-${index.start}`);
		// 		// 	this.dragIndex += 1;
		// 		// } else {
		// 		// 	data.to(`owl-slide-${pages[this.dragIndex - 1].start}`);
		// 		// 	this.dragIndex -= 1;
		// 		// }
		// 	} else {
		// 		this.initialPos = event.data.startPosition;
		// 		this.dragIndex = pages.findIndex(items => items.start === this.initialPos || items.end === this.initialPos);
		// 		console.log(this.dragIndex, pages, this.initialPos);
		// 	}
		// }



		// if (!this.options.center && this.options.dotsEach !== false && !this.options.autoWidth) {
		// 	if (!event.dragging) {
		// 		if (this.initialPos === this.endPos && this.endPos > 1) {
		// 			if (this.options.loop) {
		// 				// data.next();
		// 				// data.to('owl-slide-' + (this.initialPos + items));
		// 				if (dotsData[this.dragIndex + 1]) {
		// 					data.moveByDot(dotsData[this.dragIndex + 1].id);
		// 				} else {
		// 					data.moveByDot(dotsData[0].id);
		// 				}
		// 			}
		// 			return;
		// 		}
		// 		if (this.initialPos < this.endPos) {
		// 			// data.next();
		// 			// data.to('owl-slide-' + (this.initialPos + items));
		// 			data.moveByDot(dotsData[this.dragIndex + 1].id);
		// 			this.dotsData[1].active = true;
		// 			this.dotsData[0].active = false;
		// 		} else {
		// 			if (this.endPos !== 0) {
		// 				// data.to('owl-slide-' + value);
		// 				if (dotsData[this.dragIndex - 1]) {
		// 					data.moveByDot(dotsData[this.dragIndex - 1].id);
		// 				} else {
		// 					data.moveByDot(dotsData[0].id);
		// 				}
		// 			} else if (this.options.loop) {
		// 				// data.to('owl-slide-' + value);
		// 				if (dotsData[this.dragIndex - 1]) {
		// 					data.moveByDot(dotsData[this.dragIndex - 1].id);
		// 				} else {
		// 					data.moveByDot(dotsData[0].id);
		// 				}
		// 			}
		// 		}
		// 	} else {
		// 		this.dragIndex = dotsData.findIndex((items) => items.active);
		// 		this.initialPos = event.data.startPosition;
		// 	}
		// }
	}

	change(event: any) {
		this.endPos = event.startPosition;
	}

	ngOnDestroy() {
		if (this.subscribe) {
			this.subscribe.unsubscribe();
		}
	}
}
