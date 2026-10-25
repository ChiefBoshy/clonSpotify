import {
  trigger,
  transition,
  query,
  style,
  animate,
  group
} from '@angular/animations';

export const pageAnimation = trigger('pageAnimation', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),

    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(10px)'
        })
      ],
      { optional: true }
    ),

    group([
      query(
        ':leave',
        [
          animate(
            '150ms ease-in',
            style({ opacity: 0 })
          )
        ],
        { optional: true }
      ),

      query(
        ':enter',
        [
          animate(
            '350ms ease-out',
            style({
              opacity: 1,
              transform: 'translateY(0)'
            })
          )
        ],
        { optional: true }
      )
    ])
  ])
]);