import { style, animate, transition, trigger, state, group } from '@angular/animations';

export const slide = trigger('slide', [
  state('rightIn',
    style({
      right: '{{rightFrom}}',
      color: '{{colorFrom}}',
      transform: '{{translateFrom}}'
    }),
    {
      params: {
        rightFrom: '*',
        translateFrom: '*',
        inTime: '*',
        colorFrom: '*'
      }
    }
  ),
  state('rightOut',
    style({
      right: '{{rightTo}}',
      color: '{{colorTo}}',
      transform: '{{translateTo}}'
    }),
    {
      params: {
        rightTo: '*',
        translateTo: '*',
        outTime: '*',
        colorTo: '*'
      }
    }
  ),
  transition('rightOut => rightIn', [
    group(
      [
        animate('{{inTime}} ease-in', style({
          right: '{{rightFrom}}',
          color: '{{colorFrom}}',
          transform: '{{translateFrom}}'
        }))
      ])
  ]),
  transition('rightIn => rightOut', [
    group(
      [
        animate('{{outTime}} ease-out', style({
          right: '{{rightTo}}',
          color: '{{colorTo}}',
          transform: '{{translateTo}}'
        }))
      ])
  ]),
  transition(':enter', [
    group(
      [
        animate('{{inTime}} ease-in', style({
          color: '{{colorFrom}}',
          transform: '{{translateFrom}}'
        }))
      ])
  ])
]);

