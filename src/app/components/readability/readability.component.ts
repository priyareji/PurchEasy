import { Component, OnInit, Input, ElementRef, AfterViewInit, Directive, ContentChild, Renderer2, HostBinding, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { trigger, state, style, transition, group, animate, query } from '@angular/animations';
import { Subscription } from 'rxjs';

const accordion = trigger('accordion', [
	state(
		'on',
		style({
			overflow: '*',
			opacity: '*',
			height: '*'
		})
	),
	state(
		'off',
		style({
			overflow: 'hidden',
			height: '{{height}}',
		}),
		{
			params: {
				height: '*'
			}
		}
	),
	transition('* => off', [
		group([
			animate(
				'0ms ease',
				style({
					overflow: 'hidden'
				})
			),
			animate(
				'250ms ease',
				style({
					height: '{{height}}'
				})
			)
		])
	]),
	transition('* => on', [
		group([
			animate(
				'400ms ease',
				style({
					opacity: '*',
					height: '*',
					paddingLeft: '*',
					paddingRight: '*',
					paddingTop: '*',
					paddingBottom: '*',
					marginLeft: '*',
					marginRight: '*',
					marginTop: '*',
					marginBottom: '*'
				})
			),
			animate(
				'450ms ease',
				style({
					overflow: '*'
				})
			)
		])
	])
]);

@Directive({
	selector: 'content'
})
export class ReadabilityContent implements OnInit, AfterViewInit {

	height!: number;
	length!: number;
	contentHeight!: number;
	contentLength!: number;
	textContent!: string;
	expaned: boolean = false;
	canRead: boolean = false;
	parentEl!: HTMLElement;
	line!: number;
	updatedContent: any;
	accordion: string = '';
	@HostBinding('style.width') private width = '100%';

	constructor(
		private elRef: ElementRef,
		public locale: LocaleService,
		private renderer2: Renderer2
	) {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		const el: HTMLElement = this.elRef.nativeElement;
		this.renderer2.setStyle(el, 'display', 'block');
	}

	processContent() {
		if (navigator.onLine) {
			const el: HTMLElement = this.elRef.nativeElement;
			if (this.height) {
				this.contentHeight = el.offsetHeight;
			} else if (this.length) {
				this.contentLength = el.innerText.length;
				this.textContent = el.innerText;
			} else if (this.line) {
				this.textContent = el.innerText;
			}
			this.showLess();
		}
	}

	showMore() {
		const el: HTMLElement = this.elRef.nativeElement;
		if (this.height) {
			// this.renderer2.setStyle(el, 'max-height', ``);
			// this.renderer2.setStyle(el, 'overflow', '');
			this.accordion = 'on';
			this.expaned = true;
		} else if (this.line) {
			el.innerText = this.textContent;
			this.renderer2.setStyle(el, 'max-height', ``);
			const newEl: HTMLElement = this.renderer2.createElement('a');
			newEl.innerText = ` ...${this.locale.translate('see_less')}`;
			this.renderer2.addClass(newEl, 'read-more-text');
			this.renderer2.addClass(newEl, 'cursor-pointer');
			this.renderer2.addClass(newEl, 'hyperlink');
			this.renderer2.appendChild(el, newEl);
			this.renderer2.listen(newEl, 'click', this.showLess.bind(this));
			this.expaned = true;
		} else if (this.length) {
			el.innerText = this.textContent;
			const newEl: HTMLElement = this.renderer2.createElement('a');
			newEl.innerText = ` ${this.locale.translate('see_less')}`;
			this.renderer2.addClass(newEl, 'read-more-text');
			this.renderer2.addClass(newEl, 'cursor-pointer');
			this.renderer2.addClass(newEl, 'hyperlink');
			this.renderer2.appendChild(el, newEl);
			this.renderer2.listen(newEl, 'click', this.showLess.bind(this));
			// this.expaned = true;
		}
	}

	showLess() {
		const el: HTMLElement = this.elRef.nativeElement;
		if (this.height) {
			if (this.height < this.contentHeight) {
				// this.showMore = true;
				// this.renderer2.setStyle(el, 'max-height', `${this.height.toString()}px`);
				// this.renderer2.setStyle(el, 'overflow', 'hidden');
				this.accordion = 'off';
				this.expaned = false;
			}
		} else if (this.line) {
			if (!this.updatedContent && el) {
				const data = this.countLines(el);
				if (data.lines > this.line) {
					const finalHeight = this.line * data.lineHeight;
					this.renderer2.setStyle(el, 'max-height', `${(finalHeight).toString()}px`);
					this.renderer2.setStyle(el, 'overflow', 'hidden');
					const newEl: HTMLElement = this.renderer2.createElement('span');
					this.renderer2.setStyle(newEl, 'display', 'block');
					newEl.innerText = el.innerText;
					let text = el.innerText;
					el.innerText = '';
					this.renderer2.appendChild(el, newEl);
					const bounds = el.getBoundingClientRect();
					while (bounds.height < newEl.offsetHeight) {
						text = text.substr(0, text.length - 1);
						newEl.innerText = text + `...${this.locale.translate('see_more')}`;
						// console.log(newEl.innerText);
					}
					// console.log(newEl.innerText);
					// console.log(text.length, newEl.innerText.length);
					// let outIndex = 0;
					// if (text.length < (newEl.innerText.length - 11)) {
					// 	outIndex = newEl.innerText.length - text.length;
					// }
					let length = 11;
					if (!this.canRead) {
						length = 8;
					}
					newEl.innerText = newEl.innerText.slice(0, newEl.innerText.length - length);
					if (this.canRead) {
						const actionEl: HTMLElement = this.renderer2.createElement('a');
						actionEl.innerText = `...${this.locale.translate('see_more')}`;
						this.renderer2.addClass(actionEl, 'read-more-text');
						this.renderer2.addClass(actionEl, 'cursor-pointer');
						this.renderer2.addClass(actionEl, 'hyperlink');
						this.renderer2.listen(actionEl, 'click', this.showMore.bind(this));
						this.renderer2.appendChild(newEl, actionEl);
						this.updatedContent = newEl;
					}
					this.expaned = false;
				}
			} else {
				el.innerText = '';
				this.renderer2.appendChild(el, this.updatedContent);
			}
		} else if (this.length) {
			if (this.length < this.contentLength) {
				el.innerText = `${el.innerText.substr(0, this.length)}${(this.canRead) ? '' : '...'}`;
				if (this.canRead) {
					const newEl: HTMLElement = this.renderer2.createElement('a');
					newEl.innerText = ` ...${this.locale.translate('see_more')}`;
					this.renderer2.addClass(newEl, 'read-more-text');
					this.renderer2.addClass(newEl, 'cursor-pointer');
					this.renderer2.addClass(newEl, 'hyperlink');
					this.renderer2.appendChild(el, newEl);
					this.renderer2.listen(newEl, 'click', this.showMore.bind(this));
				}
				// this.expaned = false;
			}
		}
	}

	countLines(target: any) {
		var style = window.getComputedStyle(target, null);
		var height = parseInt(style.getPropertyValue("height"));
		var font_size = parseInt(style.getPropertyValue("font-size"));
		var line_height = parseInt(style.getPropertyValue("line-height"));
		var box_sizing = style.getPropertyValue("box-sizing");

		if (isNaN(line_height)) line_height = font_size * 1.2;

		if (box_sizing == 'border-box') {
			var padding_top = parseInt(style.getPropertyValue("padding-top"));
			var padding_bottom = parseInt(style.getPropertyValue("padding-bottom"));
			var border_top = parseInt(style.getPropertyValue("border-top-width"));
			var border_bottom = parseInt(style.getPropertyValue("border-bottom-width"));
			height = height - padding_top - padding_bottom - border_top - border_bottom
		}
		var lines = Math.ceil(height / line_height);
		return {
			lines: lines,
			lineHeight: line_height
		};
	}
}

@Component({
	selector: 'app-readability',
	templateUrl: './readability.component.html',
	styleUrls: ['./readability.component.scss'],
	animations: [accordion]
})
export class ReadabilityComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() height: number = 0;
	@Input() length: number = 0;
	@Input() line: number = 0;
	@Input() canRead = true;
	@Input() type: 'general' | 'icon' = 'icon';
	@ContentChild(ReadabilityContent) content!: ReadabilityContent;
	@Output() readMore = new EventEmitter();

	accordion = 'on';
	disableAnimation = true;
	contentHeight: number = 0;;
	contentLength: number = 0;;
	textContent: any;
	expaned: boolean = false;
	showMore = false;
	more = false;
	less = false;
	subscribe: Subscription | null = null;

	constructor(
		public locale: LocaleService,
		private elRef: ElementRef,
		private detectDevice: DetectDeviceService
	) { }

	ngOnInit(): void {
		this.subscribe = this.detectDevice.resolutionState$.subscribe(resp => {
			if (resp.isChanged && this.content && navigator.onLine) {
				this.expaned = false;
				this.accordion = 'on';
				this.content.showMore();
				this.ngAfterViewInit();
			}
		});
	}

	processContent() {
		if (navigator.onLine) {
			this.disableAnimation = false;
			if (!this.expaned) {
				this.readMore.emit({ read: true, enabled: true });
				this.content.showMore();
				this.expaned = this.content.expaned;
				this.accordion = this.content.accordion;
			} else {
				this.content.showLess();
				this.expaned = this.content.expaned;
				this.accordion = this.content.accordion;
			}
		}
	}

	ngAfterViewInit() {
		if (navigator.onLine) {
			// this.disableAnimation = false;
			this.content.height = this.height;
			this.content.length = this.length;
			this.content.line = this.line;
			this.content.canRead = this.canRead;
			this.content.parentEl = this.elRef.nativeElement.parentElement;
			this.content.processContent();
			this.expaned = this.content.expaned;
			this.accordion = this.content.accordion;
			if (this.expaned === false) {
				this.showMore = true;
			} else {
				this.showMore = false;
			}
			this.readMore.emit({ enabled: this.showMore && this.height && this.canRead });
		}
	}

	ngOnDestroy() {
		if (this.subscribe) {
			this.subscribe.unsubscribe();
		}
	}

}
