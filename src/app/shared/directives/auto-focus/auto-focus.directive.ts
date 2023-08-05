import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

	constructor(
		private element: ElementRef
	) { }

	ngAfterViewInit() {
		if (this.element && this.element.nativeElement) {
			this.element.nativeElement.focus();
		}
	}
}
