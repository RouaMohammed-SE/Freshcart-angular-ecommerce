import { Component, effect, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltersMap } from '../../../../shared/types/filters/filters-map.type';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-header',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './search-header.component.html',
  styleUrl: './search-header.component.css',
})
export class SearchHeaderComponent {
  searchQuery = model.required<string>();
  productsQuantity = input();
  activeFilters = model<FiltersMap>();

  constructor() {
    effect(() => {
      this.activeFilters.update((current) => ({
        ...current,
        q: this.searchQuery(),
      }));
    });
  }
}
