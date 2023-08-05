import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-badge',
	templateUrl: './badge.component.html',
	styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {
	@Input() type: 'button' | 'icon' = 'icon';
	@Input() count: number | string = 0;
	@Input() icon: string = '';
	@Input() svgIcon: string = '';
	@Input() size: string = '16px';
	@Input() color: string = '';
	constructor() { }

	ngOnInit(): void { }
}
