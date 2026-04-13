import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FeaturesSectionComponent } from '../../shared/components/featuresSection/features-section.component';
import { TranslatePipe } from '@ngx-translate/core';

type Destination = {
  label: string;
  route: string;
};

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, FeaturesSectionComponent, TranslatePipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  private readonly location = inject(Location);

  readonly destinations: Destination[] = [
    { label: 'All Products', route: '/products' },
    { label: 'Categories', route: '/categories' },
    { label: "Today's Deals", route: '/products' },
    { label: 'Contact Us', route: '/contact' },
  ];

  goBack(): void {
    this.location.back();
  }
}
