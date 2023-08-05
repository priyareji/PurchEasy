import { Component, OnInit, Input } from '@angular/core';
import { transition, animate, style, trigger } from '@angular/animations';

const fadeInOut = trigger('fadeInOut', [
	transition(':enter', [
		style({ opacity: 0, position: 'absolute', transform: 'scale(0)' }),
		animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'rotate(360deg) scale(1)' }))
		// animate('.3s', style({ transform: 'rotate(360deg)' }))
	]),
	transition(':leave', [
		style({ position: 'absolute' }),
		// animate('.3s', style({ transform: 'rotate(-360deg)' })),
		animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, transform: 'rotate(360deg) scale(0)' }))
	])
]);

const fadeInOut1 = trigger('fadeInOut1', [
	transition(':enter', [
		style({ opacity: 0, position: 'absolute', transform: 'scale(0)' }),
		animate('400ms cubic-bezier(.23,.42,.85,.31)', style({ opacity: 1, transform: 'rotate(360deg) scale(1)' }))
		// animate('.3s', style({ transform: 'rotate(360deg)' }))
	]),
	transition(':leave', [
		style({ position: 'absolute' }),
		// animate('.3s', style({ transform: 'rotate(-360deg)' })),
		animate('400ms cubic-bezier(.23,.42,.85,.31)', style({ opacity: 0, transform: 'rotate(360deg) scale(0)' }))
	])
]);


@Component({
	selector: 'mat-animated-icon',
	templateUrl: './mat-animated-icon.component.html',
	styleUrls: ['./mat-animated-icon.component.scss'],
	animations: [fadeInOut, fadeInOut1]
})
export class MatAnimatedIconComponent implements OnInit {
	@Input() start!: String;
	@Input() end!: String;
	@Input() colorStart!: String;
	@Input() colorEnd!: String;
	@Input() animate: boolean = false;
	@Input() animateFromParent?: boolean = false;
	@Input() size?: string = '24px';


	constructor() { }

	ngOnInit(): void {
	}

	toggle() {
		if (!this.animateFromParent) this.animate = !this.animate;
	}
}
