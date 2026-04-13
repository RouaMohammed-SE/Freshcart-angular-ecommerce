import { Component } from '@angular/core';
import { FeaturesSectionComponent } from '../../../shared/components/featuresSection/features-section.component';
import { ResetFormComponent } from './components/reset-form/reset-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [FeaturesSectionComponent, ResetFormComponent, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {}
