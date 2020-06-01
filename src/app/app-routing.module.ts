import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductListComponent} from './product-list/product-list.component';
import {ManagementPaneComponent} from './management-pane/management-pane.component';
import {CategoriesManagementComponent} from './management-pane/categories-management/categories-management.component';
import {UploadTemplateComponent} from './management-pane/upload-template/upload-template.component';
import {StoredProductsManagementComponent} from './management-pane/stored-products-management/stored-products-management.component';


const routes: Routes = [
  {path: 'management', component: ManagementPaneComponent,
    children: [
      { path:  'categories', component:  CategoriesManagementComponent},
      { path:  'upload', component:  UploadTemplateComponent},
      { path:  'storedProducts', component:  StoredProductsManagementComponent},
      {
        path: '',
        redirectTo: 'storedProducts',
        pathMatch: 'full'
      }
    ]},
  {path: 'myShopping', component: ProductListComponent},
  {path: 'contact', component: ProductListComponent},
  {path: 'products', component: ProductListComponent, children: [
      {path: '**', component: ProductListComponent}
    ]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
