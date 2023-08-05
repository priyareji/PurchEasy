import { Component, OnInit, Input, OnChanges, ElementRef, HostBinding, SimpleChanges } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
	selector: 'loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnChanges {
	@Input() loader = true;
	@Input() classes: Array<string> | string = '';
	@Input() type: 'general' | 'updated' | 'user-row-shimmer' | 'playlist-header-shimmer' = 'general';
	@Input()
	data: any = {
		icon: 'hourglass_top',
		msg: null
	};
	position: string | null = null;
	minHeight = null;
	@HostBinding('style.display') private display = 'block';
	@HostBinding('style.marginBottom') private marginBottom = '0px';
	@HostBinding('style.marginTop') private marginTop = '0px';
	@HostBinding('style.marginLeft') private marginLeft = '0px';
	@HostBinding('style.marginRight') private marginRight = '0px';

	constructor(
		public locale: LocaleService,
		private elRef: ElementRef
	) {
	}

	ngOnInit(): void {
		if (this.type !== 'general') {
			this.data.msg = this.locale.translate('loading_text');
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.hasOwnProperty('loader') && ![null, undefined].includes(changes.loader.currentValue)) {
			const el: HTMLElement = this.elRef.nativeElement.parentElement;
			if (changes.loader.currentValue) {
				// if (Array.isArray(this.classes)) {
				//   for (const cl of this.classes) {
				//     el.classList.add(cl);
				//   }
				// } else {
				//   el.classList.add(this.classes);
				// }
				if (this.type === 'general') {
					if (el.style.hasOwnProperty('position')) {
						this.position = el.style.position;
					}
					// if (el.style.hasOwnProperty('min-height')) {
					// 	this.minHeight = el.style.minHeight;
					// }
					el.style.position = 'relative';
					// el.style.minHeight = '100%';
				}
				this.display = 'block';
			} else {
				// if (Array.isArray(this.classes)) {
				//   for (const cl of this.classes) {
				//     el.classList.remove(cl);
				//   }
				// } else {
				//   el.classList.remove(this.classes);
				// }
				this.display = 'none';
				if (this.position) {
					el.style.position = this.position;
				} else {
					el.style.position = '';
				}
				// if (this.minHeight) {
				// 	el.style.minHeight = this.minHeight;
				// } else {
				// 	el.style.minHeight = '';
				// }
			}
		}
	}
}
