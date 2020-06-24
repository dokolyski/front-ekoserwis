import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductListComponent} from './product-list/product-list.component';
import {ManagementPaneComponent} from './management-pane/management-pane.component';
import {CategoriesManagementComponent} from './management-pane/categories-management/categories-management.component';
import {UploadTemplateComponent} from './management-pane/upload-template/upload-template.component';
import {StoredProductsManagementComponent} from './management-pane/stored-products-management/stored-products-management.component';
import {ContactComponent} from './contact/contact.component';
import {LoginComponent} from './login/login.component';
import {ProfileDetailsComponent} from './profile-details/profile-details.component';
import {EditProductsComponent} from './management-pane/edit-products/edit-products.component';


const routes: Routes = [
  {path: 'management', component: ManagementPaneComponent,
    children: [
      { path:  'categories', component:  CategoriesManagementComponent},
      { path:  'upload', component:  UploadTemplateComponent},
      { path:  'storedProducts', component:  StoredProductsManagementComponent},
      { path:  'edit', component:  EditProductsComponent, children: [
          {path: '**', component: EditProductsComponent}
        ]},
      {
        path: '',
        redirectTo: 'storedProducts',
        pathMatch: 'full'
      }
    ]},
  {path: 'profile', component: ProfileDetailsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'contact', component: ContactComponent},
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
