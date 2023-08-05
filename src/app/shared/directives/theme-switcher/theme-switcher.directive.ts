import { Directive, Input, Inject, Renderer2, SimpleChanges } from '@angular/core';
import { themes } from './themes.const';

@Directive({
	selector: '[appThemeSwticher]'
})
export class ThemeSwticherDirective {
	@Input() mode: 'system' | 'default' | 'default-dark' = 'system';

	constructor(private renderer2: Renderer2) { }

	ngOnInit() {
		this.checkMode();
		// document.body.classList.add(`${this.mode}`);
		this.updateTheme(this.mode);
	}

	ngOnChanges(changes: SimpleChanges) {
		// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		// if (event.matches) {
		// }
		// });
		if (changes.mode && changes.mode.currentValue) {
			// document.body.classList.remove(changes.mode.previousValue);
			this.mode = changes.mode.currentValue;
			// document.body.classList.add(`${this.mode}`);

			this.updateTheme(this.mode);
		}
	}

	updateTheme(themeName: string) {
		// const element = this.elementRef.nativeElement;
		const them = themes[themeName];
		const oldThemeName = document.body.getAttribute('data-theme-name');
		if (oldThemeName) {
			this.renderer2.removeClass(document.body, oldThemeName);
		}
		this.renderer2.setAttribute(document.body, 'data-theme-name', `${this.mode}`);
		this.renderer2.addClass(document.body, `${this.mode}`);
		for (const key in them) {
			// element.style.setProperty(key, them[key]);
			document.body.style.setProperty(key, them[key]);
		}
	}

	checkMode() {
		if (this.mode === 'system') {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.mode = 'default-dark';
			} else {
				this.mode = 'default';
			}
		}
	}
}
