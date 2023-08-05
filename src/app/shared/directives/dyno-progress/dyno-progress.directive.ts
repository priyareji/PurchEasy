import { Directive, ElementRef, Renderer2, Input, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[appDynoProgress]'
})
export class DynoProgressDirective {
	@Input() diameter: string = '100px';
	@Input() progressSize: string = '10px';
	@Input() bufferColor: string = 'var(--secondary-four)';
	@Input() progress: number = 0;
	@Input() progressColor: string = 'rgb(var(--primary-two))';
	@Input() radius: string = '0px';
	@Input() rotate: string = '0';
	@Input() antiClock: boolean = false;
	progressEl!: ElementRef;
	firstProgressEl!: ElementRef;
	firstSpanEl!: ElementRef;
	secondProgressEl!: ElementRef;
	secondSpanEl!: ElementRef;
	thirdProgressEl!: ElementRef;
	thirdSpanEl!: ElementRef;
	fourthProgressEl!: ElementRef;
	fourthSpanEl!: ElementRef;
	constructor(private renderer2: Renderer2, private elementRef: ElementRef) { }

	ngOnInit() { }
	ngOnChanges(changes: SimpleChanges) {
		if (changes.progress && changes.progress.currentValue !== changes.progress.previousValue) {
			this.progressCalculator();
		}
	}
	ngAfterViewInit() {
		const nativeEl = this.elementRef.nativeElement;
		this.setStyle(nativeEl, {
			position: 'relative',
			background: `${this.progressColor}`,
			'border-radius': `${this.radius}`,
			padding: `${this.progressSize}`,
			overflow: 'hidden',
			width: `${this.diameter}`,
			height: `${this.diameter}`
		});

		this.progressEl = this.renderer2.createElement('div');
		this.setStyle(this.progressEl, {
			position: 'absolute',
			left: '0',
			top: '0',
			bottom: '0',
			right: '0',
			transform: `rotate(${this.rotate}deg)`
		});

		this.firstProgressEl = this.renderer2.createElement('div');
		this.setStyle(this.firstProgressEl, {
			position: 'absolute',
			left: '0',
			top: '0',
			bottom: '0',
			right: '0',
			overflow: 'hidden',
			transform: 'translate(25%, -75%)',
			height: '200%',
			width: '200%'
		});

		this.firstSpanEl = this.renderer2.createElement('span');
		this.setStyle(this.firstSpanEl, {
			position: 'absolute',
			'background-color': `${this.bufferColor}`,
			transition: '300ms transform ease-in',
			'transform-origin': '0 100%',
			transform: 'rotate(0deg)',
			width: '100%',
			height: '100%'
		});

		this.renderer2.appendChild(this.firstProgressEl, this.firstSpanEl);
		this.renderer2.appendChild(this.progressEl, this.firstProgressEl);

		this.secondProgressEl = this.renderer2.createElement('div');
		this.setStyle(this.secondProgressEl, {
			position: 'absolute',
			left: '0',
			top: '0',
			bottom: '0',
			right: '0',
			overflow: 'hidden',
			transform: 'translate(25%, 25%)',
			height: '200%',
			width: '200%'
		});

		this.secondSpanEl = this.renderer2.createElement('span');
		this.setStyle(this.secondSpanEl, {
			position: 'absolute',
			'background-color': `${this.bufferColor}`,
			transition: '300ms transform ease-in',
			'transform-origin': '0 0',
			transform: 'rotate(0deg)',
			width: '100%',
			height: '100%'
		});

		this.renderer2.appendChild(this.secondProgressEl, this.secondSpanEl);
		this.renderer2.appendChild(this.progressEl, this.secondProgressEl);

		this.thirdProgressEl = this.renderer2.createElement('div');
		this.setStyle(this.thirdProgressEl, {
			position: 'absolute',
			left: '0',
			top: '0',
			bottom: '0',
			right: '0',
			overflow: 'hidden',
			transform: 'translate(-75%, 25%)',
			height: '200%',
			width: '200%'
		});

		this.thirdSpanEl = this.renderer2.createElement('span');
		this.setStyle(this.thirdSpanEl, {
			position: 'absolute',
			'background-color': `${this.bufferColor}`,
			transition: '300ms transform ease-in',
			'transform-origin': '100% 0',
			transform: 'rotate(0deg)',
			width: '100%',
			height: '100%'
		});

		this.renderer2.appendChild(this.thirdProgressEl, this.thirdSpanEl);
		this.renderer2.appendChild(this.progressEl, this.thirdProgressEl);

		this.fourthProgressEl = this.renderer2.createElement('div');
		this.setStyle(this.fourthProgressEl, {
			position: 'absolute',
			left: '0',
			top: '0',
			bottom: '0',
			right: '0',
			overflow: 'hidden',
			transform: 'translate(-75%, -75%)',
			height: '200%',
			width: '200%'
		});

		this.fourthSpanEl = this.renderer2.createElement('span');
		this.setStyle(this.fourthSpanEl, {
			position: 'absolute',
			'background-color': `${this.bufferColor}`,
			transition: '300ms transform ease-in',
			'transform-origin': '100% 100%',
			transform: 'rotate(0deg)',
			width: '100%',
			height: '100%'
		});

		this.renderer2.appendChild(this.fourthProgressEl, this.fourthSpanEl);
		this.renderer2.appendChild(this.progressEl, this.fourthProgressEl);

		this.setStyle(nativeEl.firstChild, {
			position: 'relative',
			'z-index': `1`,
			background: 'white',
			'border-radius': `${this.radius}`,
			overflow: 'hidden',
			width: '100%',
			height: '100%',
			display: 'flex',
			'place-content': 'center',
			'align-items': 'center'
		});

		this.renderer2.appendChild(nativeEl, this.progressEl);
		this.progressCalculator();
	}

	setStyle(element: ElementRef, styles: any = {}) {
		if (element) {
			Object.keys(styles).map((key) => {
				this.renderer2.setStyle(element, key, styles[key]);
			});
		}
	}

	progressCalculator() {
		if (this.progress >= 0) {
			const crtProgress = 360 * this.progress / 100;
			let firstSpanValue = 0;
			let secondSpanValue = 0;
			let thirdSpanValue = 0;
			let fourthSpanValue = 0;
			if (this.antiClock) {
				if (crtProgress >= 0 && crtProgress <= 90) {
					fourthSpanValue = -(crtProgress);
				} else if (crtProgress > 90 && crtProgress <= 180) {
					fourthSpanValue = -90;
					thirdSpanValue = -(crtProgress - 90);
				} else if (crtProgress > 180 && crtProgress <= 270) {
					fourthSpanValue = -90;
					thirdSpanValue = -90;
					secondSpanValue = -(crtProgress - 180);
				} else if (crtProgress > 270 && crtProgress <= 360) {
					fourthSpanValue = -90;
					thirdSpanValue = -90;
					secondSpanValue = -90;
					firstSpanValue = -(crtProgress - 270);
				} else {
					fourthSpanValue = -90;
					thirdSpanValue = -90;
					secondSpanValue = -90;
					firstSpanValue = -90;
				}
			} else {
				if (crtProgress >= 0 && crtProgress <= 90) {
					firstSpanValue = crtProgress;
				} else if (crtProgress > 90 && crtProgress <= 180) {
					firstSpanValue = 90;
					secondSpanValue = crtProgress - 90;
				} else if (crtProgress > 180 && crtProgress <= 270) {
					firstSpanValue = 90;
					secondSpanValue = 90;
					thirdSpanValue = crtProgress - 180;
				} else if (crtProgress > 270 && crtProgress <= 360) {
					firstSpanValue = 90;
					secondSpanValue = 90;
					thirdSpanValue = 90;
					fourthSpanValue = crtProgress - 270;
				} else {
					firstSpanValue = 90;
					secondSpanValue = 90;
					thirdSpanValue = 90;
					fourthSpanValue = 90;
				}
			}
			this.setStyle(this.firstSpanEl, {
				transform: `rotate(${firstSpanValue}deg)`
			});
			this.setStyle(this.secondSpanEl, {
				transform: `rotate(${secondSpanValue}deg)`
			});
			this.setStyle(this.thirdSpanEl, {
				transform: `rotate(${thirdSpanValue}deg)`
			});
			this.setStyle(this.fourthSpanEl, {
				transform: `rotate(${fourthSpanValue}deg)`
			});
		}
	}
}
