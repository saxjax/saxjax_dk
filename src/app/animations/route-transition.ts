import { style, transition, trigger, query, animate, group } from "@angular/animations";

export const routeTransition = trigger('routeTransition',[
  transition(':enter', [
      style({height:0,opacity:0}),
    query('.content', [
      style({translate:'0 100%'}),
    ], { optional: true }),
    group([
    animate('1s ease-in', style({ height: '*', opacity: 1 }),),
    query('.content', [
          animate('1s ease-in', style({translate:'0 0'}),)
    ], { optional: true }),
    ])
  ]),
])
