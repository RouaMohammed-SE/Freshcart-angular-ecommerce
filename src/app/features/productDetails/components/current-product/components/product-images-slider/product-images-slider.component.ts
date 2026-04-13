import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { IProduct } from '../../../../../../core/models/products/product.model';
import { ensureSwiperElements } from '../../../../../../shared/utils/ensure-swiper-elements';

@Component({
  selector: 'app-product-images-slider',
  imports: [],
  templateUrl: './product-images-slider.component.html',
  styleUrl: './product-images-slider.component.css',
  host: { ngSkipHydration: 'true' },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductImagesSliderComponent implements OnInit {
  activeIndex = signal(0);
  product = input<IProduct>();
  @ViewChild('mainSwiper', { static: false })
  mainSwiper!: ElementRef;
  @ViewChild('thumbSwiper', { static: false })
  thumbSwiper!: ElementRef;

  ngOnInit(): void {
    void ensureSwiperElements();
  }

  goToSlide(index: number): void {
    const main = this.mainSwiper?.nativeElement?.swiper;
    const thumbs = this.thumbSwiper?.nativeElement?.swiper;

    if (thumbs) {
      thumbs.slideTo(index - 1);
    }
    if (main) {
      main.slideTo(index);
      this.activeIndex.set(index);
    }
  }
}
