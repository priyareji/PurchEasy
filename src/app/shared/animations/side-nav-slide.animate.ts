import { trigger, state, style, transition, animate, animateChild, query, group } from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
	state(
		'close',
		style({
			width: '{{width}}', // desktop 40, mobile 0
			'max-width': '{{maxWidth}}' // desktop 40, mobile 0
		}),
		{
			params: {
				width: '*',
				maxWidth: '*'
			}
		}
	),
	state(
		'open',
		style({
			width: '42px',
			'max-width': '100%'
		})
	),
	// transition(':enter', [
	// 	animate(
	// 		2000,
	// 		style({
	// 			width: '42px',
	// 			'max-width': '100%'
	// 		})
	// 	)
	// ]),
	transition('close => open', [
		group([
			animate('200ms ease')
			// query('@slide', [animateChild()]),
			// query('@fade', [animateChild()]),
		]),
		query(':self', [animateChild()], { optional: true })
	]),
	transition('open => close', [
		query(':self', [animateChild()], { optional: true }),
		group([
			// query('@*', [animateChild()], { optional: true }),
			// query('@fade', [animateChild()]),
			// query('@slide', [animateChild()]),
			animate('100ms ease')
		])
	])
]);

export const onMainContentChange = trigger('onMainContentChange', [
	state(
		'close',
		style({
			'margin-left': '{{marginLeft}}' // desktop 40, mobile 0
		}),
		{
			params: {
				marginLeft: '*'
			}
		}
	),
	state(
		'open',
		style({
			'margin-left': '{{marginLeft}}' // desktop 40, mobile 0
		}),
		{
			params: {
				marginLeft: '*'
			}
		}
	),
	transition('* => open', [animate('0ms ease')]),
	transition('* => close', [animate('0ms ease')])
]);

export const fade = trigger('fade', [
	state(
		'out',
		style({
			opacity: '0',
			display: 'none'
		})
	),
	state(
		'in',
		style({
			opacity: '1',
			display: '*'
		})
	),
	transition('* => in', [
		group([
			animate(
				'0ms 100ms ease',
				style({
					opacity: '1'
					// display: '*',
				})
			)
		])
	]),
	transition('* => out', [
		group([
			animate(
				'0ms 100ms ease',
				style({
					opacity: '0'
					// display: 'none',
				})
			)
		])
	])
]);
