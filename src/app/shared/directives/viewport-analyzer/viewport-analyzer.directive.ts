import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
	selector: '[appViewportAnalyzer]'
})
export class ViewportAnalyzerDirective {

	@Input() type: 'bottom' = 'bottom';
	@Output() analyzedData = new EventEmitter<{
		bottom: boolean
	}>();

	constructor() { }

	@HostListener('scroll', ['$event.target'])
	onScrollHandler(target: HTMLElement) {
		if (target) {
			if (this.type === 'bottom') {
				if ((target.scrollTop + target.offsetHeight) > target.scrollHeight - 2) {
					this.analyzedData.emit({ bottom: true });
					const loaderEl: HTMLElement | null = target.querySelector('.loader');
					if (loaderEl) {
						loaderEl.scrollIntoView();
					}
				}
			}
		}
	}

}
