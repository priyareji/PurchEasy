import { style, animate, transition, trigger, state, group } from '@angular/animations';

export const transform = trigger('transform', [
  state('on',
    style({
      transform: '{{transformFrom}}'
    }),
    {
      params: {
        transformFrom: '*',
        inTime: '*',
      }
    }
  ),
  state('off',
    style({
      transform: '{{transformTo}}'
    }),
    {
      params: {
        transformTo: '*',
        outTime: '*'
      }
    }
  ),
  transition('off => on', [
    group(
      [
        animate('{{inTime}} ease-in', style({
          transform: '{{transformFrom}}'
        }))
      ])
  ]),
  transition('on => off', [
    group(
      [
        animate('{{outTime}} ease-out', style({
          transform: '{{transformTo}}'
        }))
      ])
  ])
]);

