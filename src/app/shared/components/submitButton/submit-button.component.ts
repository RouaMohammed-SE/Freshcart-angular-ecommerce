import { Component, input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css',
})
export class SubmitButtonComponent {
  isSubmittingForm = input<boolean>(false);
  text = input<string>('Submit');
  textOnSubmit = input<string>('Submiting');
}
