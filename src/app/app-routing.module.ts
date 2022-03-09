import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/categories',
    pathMatch: 'full'
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesPageModule)
  },
  {
    path: 'subcategories',
    loadChildren: () => import('./subcategories/subcategories.module').then( m => m.SubcategoriesPageModule)
  },
  {
    path: 'favourites',
    loadChildren: () => import('./favourites/favourites.module').then(m => m.FavouritesPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'notifications-view',
    loadChildren: () => import('./notifications-view/notifications-view.module').then(m => m.NotificationsViewPageModule)
  },
  {
    path: 'zoom',
    loadChildren: () => import('./zoom/zoom.module').then(m => m.ZoomPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'terms-of-use',
    loadChildren: () => import('./terms-of-use/terms-of-use.module').then(m => m.TermsOfUsePageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./product/listing/product-listing.module').then(m => m.ProductListingPageModule)
  },
  {
    path: 'product/:productId',
    loadChildren: () => import('./product/details/product-details.module').then(m => m.ProductDetailsPageModule)
  },
  {
    path: 'product-catalogue',
    loadChildren: () => import('./product-catalogue/product-catalogue.module').then(m => m.ProductCataloguetPagePageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search-product.module').then(m => m.SearchProductPageModule)
  },
  {
    path: 'contact-card',
    loadChildren: () => import('./contact-card/contact-card.module').then(m => m.ContactCardPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'showcase',
    loadChildren: () => import('./showcase/showcase.module').then(m => m.ShowcasePageModule)
  },
  {
    path: 'compare',
    loadChildren: () => import('./compare/compare-product.module').then(m => m.CompareProductPageModule)
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
