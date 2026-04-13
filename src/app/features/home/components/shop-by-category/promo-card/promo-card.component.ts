import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface IPromoCard {
  id: number;
  icon: string;
  badgeKey: string;
  titleKey: string;
  descriptionKey: string;
  discount: string;
  code: string;
  buttonKey: string;
  containerClass: string;
  buttonClass: string;
}

@Component({
  selector: 'app-promo-card',
  imports: [TranslatePipe],
  templateUrl: './promo-card.component.html',
  styleUrl: './promo-card.component.css',
})
export class PromoCardComponent {
  promoCard = input.required<IPromoCard>();
}
