import { Directive, ElementRef, HostListener, Input, OnInit, EventEmitter, Output, Renderer2, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[appClickOutSide]'
})
export class ClickOutSideDirective implements OnInit, OnDestroy, OnChanges {

	@Input() template!: HTMLElement;
	@Input() position: 'top' | 'bottom' | 'left' | 'right' | 'top start' | 'top center' | 'top end'
		| 'bottom start' | 'bottom center' | 'bottom end' | 'left start' | 'left center' | 'left end' | 'right start' | 'right center' | 'right end' = 'top';
	@Input() eventType: 'click' | 'hover' = 'click';
	@Output() isOpen = new EventEmitter<boolean>();
	@Input() close: boolean = false;
	@Input() additionalOptions: {
		extraPX?: number | null | undefined
	} = { extraPX: 2 };
	@Input() readonly = false;

	track: boolean = false;
	newTemplate!: HTMLElement | null;
	timeout: any;
	primaryPosition = '';
	secondaryPosition = '';
	templateRef!: HTMLElement;
	alignedPositions: any = {
		left: null,
		right: null,
		top: null,
		bottom: null
	};
	srcPos: any;

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2
	) { }

	ngOnInit() {
		this.positionSetup();
		this.templateRef = this.template;
		this.renderer.removeChild(this.elementRef.nativeElement, this.template);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.hasOwnProperty('close')) {
			if (changes.close.currentValue) {
				setTimeout(() => {
					this.removeElement();
				});
			}
		}
		if (changes.hasOwnProperty('readonly')) {
			if (!changes.readonly.currentValue && changes.readonly.previousValue) {
				this.track = true;
				this.addElement();
				this.isOpen.emit(true);
			}
		}
	}

	positionSetup() {
		const data = this.position.split(' ');
		if (data.length > 1) {
			this.primaryPosition = data[0];
			this.secondaryPosition = data[1];
		} else {
			this.primaryPosition = data[0];
			this.secondaryPosition = 'start';
		}
		// this.primaryPosition = 'bottom';
		// this.secondaryPosition = 'center';
	}

	@HostListener('mouseenter', ['$event', '$event.target'])
	onMouseEnter(event: any, targetElement: HTMLElement) {
		if (this.eventType === 'hover' && !this.readonly && navigator.onLine) {
			if (!this.newTemplate) {
				if (this.timeout) {
					clearTimeout(this.timeout);
				}
				this.timeout = setTimeout(() => {
					this.track = true;
					this.addElement();
					this.isOpen.emit(true);
				}, 100);
			}
		}
	}

	@HostListener('document:mousemove', ['$event', '$event.target'])
	onMouseLeave(event: any, targetElement: HTMLElement) {
		if (this.eventType === 'hover' && !this.readonly && navigator.onLine) {
			if (this.newTemplate) {
				if (this.timeout) {
					clearTimeout(this.timeout);
				}
				this.timeout = setTimeout(() => {
					if (this.newTemplate && !this.newTemplate.contains(targetElement) && !this.track && !this.elementRef.nativeElement.contains(targetElement)) {
						this.removeElement();
						this.track = true;
						this.isOpen.emit(false);
					}
				}, 100);
			}
		}
	}

	@HostListener('click', ['$event', '$event.target'])
	onElementClick(event: MouseEvent, targetElement: HTMLElement): void {
		if (this.eventType === 'click' && !this.readonly && navigator.onLine) {
			if (!targetElement) {
				return;
			}
			if (!this.newTemplate) {
				this.track = true;
				this.addElement();
				this.isOpen.emit(true);
			} else {
				if (!this.newTemplate.contains(targetElement)) {
					this.isOpen.emit(false);
					this.removeElement();
				}
			}
		}
	}

	@HostListener('document:click', ['$event', '$event.target'])
	public onClick(event: MouseEvent, targetElement: HTMLElement): void {
		if (this.eventType === 'click' && !this.readonly && navigator.onLine) {
			if (!targetElement) {
				return;
			}
			if (this.newTemplate) {
				if (!this.newTemplate.contains(targetElement) && !this.track && !this.elementRef.nativeElement.contains(targetElement)) {
					this.removeElement();
					this.track = true;
					this.isOpen.emit(false);
				}
			}
		}
	}

	addElement() {
		if (this.newTemplate && this.elementRef.nativeElement.contains(this.newTemplate)) {
			return;
		}
		this.newTemplate = this.renderer.createElement('div');
		this.renderer.addClass(this.newTemplate, 'template');
		this.renderer.appendChild(this.newTemplate, this.templateRef);
		// this.renderer.appendChild(this.elementRef.nativeElement, this.newTemplate);
		const el: HTMLElement = this.elementRef.nativeElement;
		this.srcPos = this.elementRef.nativeElement.getBoundingClientRect();
		// this.renderer.setStyle(this.newTemplate, 'top', this.srcPos.top);
		// this.renderer.setStyle(this.newTemplate, 'bottom', this.srcPos.bottom);
		// this.renderer.setStyle(this.newTemplate, 'left', this.srcPos.left);
		// this.renderer.setStyle(this.newTemplate, 'right', this.srcPos.right);
		(this.newTemplate ? document.body.appendChild(this.newTemplate) : '');
		this.renderer.setStyle(this.newTemplate, 'position', 'absolute');
		this.renderer.setStyle(this.newTemplate, 'z-index', '1000');
		this.renderer.setStyle(this.elementRef.nativeElement, 'position', 'relative');
		// For Style
		if (this.eventType === 'hover') { }
		this.setPosition();
		this.fitElement();
		this.track = false;
	}

	setPosition() {
		// this.renderer.removeStyle(this.newTemplate, 'left');
		// this.renderer.removeStyle(this.newTemplate, 'right');
		// this.renderer.removeStyle(this.newTemplate, 'top');
		// this.renderer.removeStyle(this.newTemplate, 'bottom');

		this.renderer.setStyle(this.newTemplate, 'top', `${this.srcPos.top}px`);
		// this.renderer.setStyle(this.newTemplate, 'bottom', `${this.srcPos.bottom}px`);
		this.renderer.setStyle(this.newTemplate, 'left', `${this.srcPos.left}px`);
		// this.renderer.setStyle(this.newTemplate, 'right', `${this.srcPos.right}px`);
		this.alignedPositions = this.getPosition();
		// return;
		if (this.alignedPositions.left !== undefined) {
			this.renderer.setStyle(this.newTemplate, 'left', `${this.srcPos.left - this.alignedPositions.left}px`);
		}
		if (this.alignedPositions.right !== undefined) {
			// this.renderer.setStyle(this.newTemplate, 'right', `${this.alignedPositions.right}px`);
		}
		if (this.alignedPositions.top !== undefined) {
			this.renderer.setStyle(this.newTemplate, 'top', `${this.srcPos.top - this.alignedPositions.top}px`);
		}
		if (this.alignedPositions.bottom !== undefined) {
			// this.renderer.setStyle(this.newTemplate, 'bottom', `${this.alignedPositions.bottom}px`);
		}
	}

	getPosition(): void | object {
		if (this.newTemplate) {
			const tooltipEl = this.newTemplate.getBoundingClientRect();
			const src = this.elementRef.nativeElement.getBoundingClientRect();
			let top;
			let left;
			let right;
			let bottom;
			if (this.primaryPosition === 'top') {
				if (this.secondaryPosition === 'center') {
					const srcCenter = src.width / 2;
					const tooltipCenter = tooltipEl.width / 2;
					const topValue = tooltipCenter - srcCenter;
					if (topValue > 0) {
						left = topValue;
					} else {
						left = topValue * -1;
					}
				} else if (this.secondaryPosition === 'end') {
					left = tooltipEl.width - src.width;
				}
				if (this.additionalOptions.extraPX)
					top = tooltipEl.height + this.additionalOptions.extraPX;
			} else if (this.primaryPosition === 'bottom') {
				if (this.secondaryPosition === 'center') {

					const srcCenter = src.width / 2;
					const tooltipCenter = tooltipEl.width / 2;
					const topValue = tooltipCenter - srcCenter;
					if (topValue > 0) {
						left = topValue;
					} else {
						left = topValue * -1;
					}

				} else if (this.secondaryPosition === 'end') {
					left = (tooltipEl.width - src.width);
				}
				if (this.additionalOptions.extraPX)
					top = (src.height + this.additionalOptions.extraPX) * -1;
			} else if (this.primaryPosition === 'left') {
				if (this.secondaryPosition === 'center') {
					const srcCenter = src.height / 2;
					const tooltipCenter = tooltipEl.height / 2;
					const topValue = tooltipCenter - srcCenter;
					if (topValue > 0) {
						top = topValue;
					} else {
						top = topValue * -1;
					}
				} else if (this.secondaryPosition === 'end') {
					top = (tooltipEl.height - src.height);
				}
				if (this.additionalOptions.extraPX)
					left = tooltipEl.width + this.additionalOptions.extraPX;
			} else if (this.primaryPosition === 'right') {
				if (this.secondaryPosition === 'center') {
					const srcCenter = src.height / 2;
					const tooltipCenter = tooltipEl.height / 2;
					const topValue = tooltipCenter - srcCenter;
					if (topValue > 0) {
						top = topValue;
					} else {
						top = topValue * -1;
					}
				} else if (this.secondaryPosition === 'end') {
					top = (tooltipEl.height - src.height);
				}
				if (this.additionalOptions.extraPX)
					left = (src.width + this.additionalOptions.extraPX) * -1;
			}
			return {
				left,
				right,
				top,
				bottom
			}
		}
	}

	fitElement() {
		if (this.newTemplate) {
			const view = this.isInViewport(this.newTemplate);
			const tooltipEl = this.newTemplate.getBoundingClientRect();
			if (view.top || view.bottom || view.left || view.right) {
				// if (view.right) {
				// 	this.alignedPositions.left = this.alignedPositions.left - (tooltipEl.right - window.innerWidth) - 8;
				// 	this.renderer.setStyle(this.newTemplate, 'left', `${this.alignedPositions.left}px`);
				// }
				// return;
				let primaryPos = this.primaryPosition;
				let secondaryPos = this.secondaryPosition;
				if (this.primaryPosition === 'top') {
					if (view.top) {
						primaryPos = 'bottom';
					} else if (view.left) {
						secondaryPos = 'start';
					} else if (view.right) {
						secondaryPos = 'end';
					}
				} else if (this.primaryPosition === 'bottom') {
					if (view.bottom) {
						primaryPos = 'top';
					} else if (view.left) {
						secondaryPos = 'start';
					} else if (view.right) {
						secondaryPos = 'end';
					}
				} else if (this.primaryPosition === 'left') {
					if (view.left) {
						primaryPos = 'right';
					} else if (view.top) {
						secondaryPos = 'start';
					} else if (view.bottom) {
						secondaryPos = 'end';
					}
				} else if (this.primaryPosition === 'right') {
					if (view.right) {
						primaryPos = 'right';
					} else if (view.top) {
						secondaryPos = 'start';
					} else if (view.bottom) {
						secondaryPos = 'end';
					}
				}
				this.primaryPosition = primaryPos;
				this.secondaryPosition = secondaryPos;
				this.setPosition();
			}
		}
	}

	isInViewport(elem: HTMLElement) {
		var bounding = elem.getBoundingClientRect();
		const returnData = {
			top: false,
			bottom: false,
			left: false,
			right: false
		};
		if (bounding.top < 0) {
			returnData.top = true;
		}
		if (bounding.left < 0) {
			returnData.left = true;
		}
		if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
			returnData.bottom = true;
		}
		if (bounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
			returnData.right = true;
		}
		return returnData;
	};

	removeElement() {
		if (this.newTemplate && !this.readonly && navigator.onLine) {
			this.renderer.removeChild(this.elementRef.nativeElement, this.newTemplate);
			this.newTemplate = null;
		}
	}

	ngOnDestroy() {
		this.removeElement();
	}
}
