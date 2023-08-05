import { trigger, state, style, transition, animate, group, animateChild, query } from '@angular/animations';

export const accordionY = trigger('accordionY', [
	state(
		'on',
		style({
			width: '*',
			'min-width': '*',
			'max-width': '*',
			overflow: '*',
			opacity: '*'
		})
	),
	state(
		'off',
		style({
			width: '0px',
			'min-width': '0px',
			'max-width': '0px',
			overflow: 'hidden',
			opacity: '0'
		})
	),
	transition('on => off', [
		group([
			animate(
				'200ms ease',
				style({
					overflow: 'hidden'
				})
			),
			query('@*', [animateChild()], { optional: true }),
			animate(
				'250ms ease',
				style({
					opacity: '0',
					width: '0px',
					'min-width': '0px',
					'max-width': '0px'
				})
			)
		])
	]),
	transition('off => on', [
		group([
			query('@*', [animateChild()], { optional: true }),
			animate(
				'200ms ease',
				style({
					opacity: '*',
					width: '*',
					'min-width': '*',
					'max-width': '*'
				})
			),
			animate(
				'250ms ease',
				style({
					overflow: '*'
				})
			)
		])
	]),
	transition(':enter', [
		group([
			query('@*', [animateChild()], { optional: true }),
			animate(
				'200ms ease',
				style({
					opacity: '*',
					width: '*',
					'min-width': '*',
					'max-width': '*'
				})
			),
			animate(
				'250ms ease',
				style({
					overflow: '*'
				})
			)
		])
	]),
	transition(':leave', [
		group([
			animate(
				'200ms ease',
				style({
					overflow: 'hidden'
				})
			),
			query('@*', [animateChild()], { optional: true }),
			animate(
				'250ms ease',
				style({
					opacity: '0',
					width: '0px',
					'min-width': '0px',
					'max-width': '0px'
				})
			)
		])
	])
]);
export const accordionX = trigger('accordionX', [
	state(
		'on',
		style({
			overflow: '*',
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
	state(
		'off',
		style({
			overflow: 'hidden',
			opacity: '0',
			height: '0px',
			paddingLeft: '0px',
			paddingRight: '0px',
			paddingTop: '0px',
			paddingBottom: '0px',
			marginLeft: '0px',
			marginRight: '0px',
			marginTop: '0px',
			marginBottom: '0px'
		})
	),
	transition('* => off', [
		group([
			animate(
				'0ms ease',
				style({
					overflow: 'hidden'
				})
			),
			query('@*', [animateChild()], { optional: true }),
			animate(
				'250ms ease',
				style({
					opacity: '0',
					height: '0px',
					paddingLeft: '0px',
					paddingRight: '0px',
					paddingTop: '0px',
					paddingBottom: '0px',
					marginLeft: '0px',
					marginRight: '0px',
					marginTop: '0px',
					marginBottom: '0px'
				})
			)
		])
	]),
	transition('* => on', [
		group([
			query('@*', [animateChild()], { optional: true }),
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
	]),
	transition(':enter', [
		group([
			query('@*', [animateChild()], { optional: true }),
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
	]),
	transition(':leave', [
		group([
			animate(
				'0ms ease',
				style({
					overflow: 'hidden'
				})
			),
			query('@*', [animateChild()], { optional: true }),
			animate(
				'250ms ease',
				style({
					opacity: '0',
					height: '0px',
					paddingLeft: '0px',
					paddingRight: '0px',
					paddingTop: '0px',
					paddingBottom: '0px',
					marginLeft: '0px',
					marginRight: '0px',
					marginTop: '0px',
					marginBottom: '0px'
				})
			)
		])
	])
]);
