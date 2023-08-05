import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { accordionX } from '@app/shared/animations/accordion.animate';
import {
	CollapsibleBlockData,
	CollapsibleBlockToggle,
	CollapsibleBlockAction
} from '../utilities/models/collapsible-model';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';

@Component({
	selector: 'app-collapsible-block',
	templateUrl: './collapsible-block.component.html',
	styleUrls: ['./collapsible-block.component.scss'],
	animations: [accordionX]
})
export class CollapsibleBlockComponent implements OnInit {
	defaultColor = 'var(--secondary-four)';
	@Input() data: CollapsibleBlockData;
	@Input() color = this.defaultColor;
	@Input() borderColor = this.defaultColor;
	@Input() openColor = null;
	@Input() openBorderColor = null;
	@Input() radius = null;
	@Input() toggle: CollapsibleBlockToggle;
	@Input() action: Array<CollapsibleBlockAction>;

	@Output() opened = new EventEmitter();
	@ViewChild('collapsibleBlockEl') collapsibleBlockEl: ElementRef;
	collapsibleBlockNativeEl;
	@ViewChild('collapsibleHeaderEl') collapsibleHeaderEl: ElementRef;
	collapsibleHeaderNativeEl;

	collapsible = 'off';
	isOpened = false;
	disableAnimation = false;
	timeout;

	constructor(
		private el: ElementRef,
		private renderer2: Renderer2,
		private cdref: ChangeDetectorRef,
		public detectDevice: DetectDeviceService,
	) { }

	ngOnInit(): void {
		if (this.toggle.hasOwnProperty('expanded') && this.toggle.expanded) {
			this.collapsible = 'on';
			this.disableAnimation = false;
			this.isOpened = true;
		} else {
			this.disableAnimation = true;
		}
	}

	ngOnChanges(changes) {
		if (changes.toggle && changes.toggle.currentValue && changes.toggle.previousValue) {
			if (changes.toggle.currentValue.expanded !== this.isOpened) {
				this.toggleBlock();
			}
		}
		if (changes.color && changes.color.currentValue) {
			if (this.collapsibleHeaderNativeEl) {
				this.renderer2.setStyle(this.collapsibleHeaderNativeEl, 'background-color', changes.color.currentValue);
			}
			if (this.borderColor === this.defaultColor || this.borderColor === changes.color.previousValue) {
				this.borderColor = changes.color.currentValue;
				if (this.collapsibleBlockNativeEl) {
					this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.borderColor);
				}
			}
		}
		if (changes.radius && changes.radius.currentValue) {
			if (this.collapsibleBlockNativeEl) {
				this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-radius', changes.radius.currentValue);
				if (this.radius) {
					this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'overflow', 'hidden');
				}
			}
		}
		if (changes.borderColor && changes.borderColor.currentValue) {
			if (this.collapsibleBlockNativeEl) {
				this.renderer2.setStyle(
					this.collapsibleBlockNativeEl,
					'border-color',
					changes.borderColor.currentValue
				);
			}
		}
	}

	ngAfterViewInit() {
		this.collapsibleHeaderNativeEl = this.collapsibleHeaderEl.nativeElement;
		this.collapsibleBlockNativeEl = this.collapsibleBlockEl.nativeElement;

		if (this.collapsibleBlockNativeEl) {
			if (this.toggle.expanded && this.openBorderColor) {
				this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.openBorderColor);
			} else if (this.toggle.expanded && !this.openBorderColor && this.openColor) {
				this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.openColor);
			} else {
				this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.borderColor);
			}
		}

		if (this.collapsibleBlockNativeEl) {
			this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-radius', this.radius);
			if (this.radius) {
				this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'overflow', 'hidden');
			}
		}

		if (this.collapsibleHeaderNativeEl) {
			if (this.toggle.expanded && this.openColor) {
				this.renderer2.setStyle(this.collapsibleHeaderNativeEl, 'background-color', this.openColor);
			} else {
				this.renderer2.setStyle(this.collapsibleHeaderNativeEl, 'background-color', this.color);
			}
		}
	}

	toggleBlock() {
		this.disableAnimation = false;
		this.isOpened = !this.isOpened;
		this.opened.emit(this.isOpened);
		this.collapsible = this.isOpened ? 'on' : 'off';

		if (this.openColor || this.openBorderColor) {
			if (this.isOpened) {
				if (this.collapsibleHeaderNativeEl && this.openColor) {
					this.renderer2.setStyle(this.collapsibleHeaderNativeEl, 'background-color', this.openColor);
				}
				if (this.collapsibleBlockNativeEl) {
					if (this.openBorderColor) {
						this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.openBorderColor);
					} else if (!this.openBorderColor && this.openColor) {
						this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.openColor);
					}
				}
			} else {
				if (this.collapsibleHeaderNativeEl && this.openColor) {
					this.renderer2.setStyle(this.collapsibleHeaderNativeEl, 'background-color', this.color);
				}

				if (this.collapsibleBlockNativeEl) {
					this.renderer2.setStyle(this.collapsibleBlockNativeEl, 'border-color', this.borderColor);
				}
			}
		}

		if (this.isOpened) {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
			const el: HTMLElement = this.collapsibleBlockNativeEl;
			if (el) {
				this.cdref.detectChanges();
				const screenHeight = window.innerHeight;
				this.timeout = setTimeout(() => {
					const el1 = el.getBoundingClientRect();
					if (el1) {
						if ((el1.top + el1.height) >= screenHeight || el1.top < 0) {
							el.scrollIntoView(
								{
									behavior: 'smooth'
								}
							);
						}
					}
				}, 300);

			}

		} else {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
		}

	}
}
