
import {
  trigger,
  transition,
  query,
  style,
  animate,
  stagger
} from '@angular/animations';

export const tableAnimation = trigger('tableAnimation', [
  transition(':enter', [
    query(
      '.table-row',
      [
        style({
          opacity: 0,
          transform: 'translateY(12px)'
        }),
        stagger('50ms', [
          animate(
            '300ms ease-out',
            style({
              opacity: 1,
              transform: 'translateY(0)'
            })
          )
        ])
      ],
      { optional: true }
    )
  ])
]);
