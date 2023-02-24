export const extensionRoutes = [  {
    path: 'extensions/bookings',
    loadChildren: () => import('./extensions/d536adaa6112293d28b8f29722a1abe2ed37500368834f1322ff52ca3f0aae06/booking-ui-lazy.module').then(m => m.BookingUiLazyModule),
  },
  {
    path: 'extensions/product-reviews',
    loadChildren: () => import('./extensions/7db3535c7f46df86e4fc646cb447e4ea2784ac93aab30d1c82ffe3e031cc5d88/reviews-ui-lazy.module').then(m => m.ReviewsUiLazyModule),
  }];
