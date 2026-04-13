let swiperElementsPromise: Promise<void> | null = null;

export function ensureSwiperElements(): Promise<void> {
  if (!swiperElementsPromise) {
    swiperElementsPromise = import('swiper/element/bundle').then(({ register }) => {
      register();
    });
  }

  return swiperElementsPromise;
}
