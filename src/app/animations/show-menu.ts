import { style, transition, trigger, state, animate } from "@angular/animations";
const hidden = { opacity:0.5, height:'5%',transform: 'translateY(-10%)' }
const active = { opacity:1, height: '20%', transform: 'translateY(0%)' }
const dorment = { opacity: 0.5, height: '10%', transform: 'translateY(-10%)' }

const timingIn = '1s ease-in'
const timingToActive = '0.3s ease-in'
const timingToDorment = '0.5s ease-out'

export const showMenu = trigger("showMenu", [
  transition(':enter', [style(hidden),
  animate(timingIn, style(active))
  ]),
  state('initial', style(hidden)),
  state('closed', style(dorment)),
  state('open', style(active)),
  transition('initial => open', [animate(timingIn)]),
  transition('closed => open', [animate(timingToActive)]),
  transition('open => closed', [animate(timingToDorment)]),
]);
