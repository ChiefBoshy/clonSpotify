import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

export const trackAnimation = trigger('trackAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(12px)'
    }),
    animate(
      '500ms ease-out',
      style({
        opacity: 1,
        transform: 'translateY(0)'
      })
    )
  ])
]);