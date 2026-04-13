import { Component } from '@angular/core';
import { BreadcrumbHeaderComponent } from '../../shared/components/breadcrumbHeader/breadcrumb-header.component';
import { FeaturesSectionComponent } from '../../shared/components/featuresSection/features-section.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [BreadcrumbHeaderComponent, FeaturesSectionComponent, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
