import { trigger, animateChild, group, transition, animate, style, query, state } from '@angular/animations';

// Routable animations
export const flipBlockAnimation = trigger('flipBlockAnimation', [
	state(
		'closed',
		style({
			display: 'none'
		})
	),
	transition('active => closed', [
		group([
			animate(
				'0ms ease',
				style({
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					background: 'white',
					'box-shadow': '0px 0px 3px 0px var(--secondary-three)',
					padding: '5px',
					'transform-origin': '0 0',
					'z-index': 1
				})
			),
			query('@*', [animateChild()], { optional: true }),
			animate(
				'.5s ease',
				style({
					transform: 'rotate3d(0,0,1,-90deg)'
				})
			),
			animate(
				'.8s ease',
				style({
					opacity: '0'
				})
			)
		])
	])
]);
