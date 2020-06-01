import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CategoriesManagementComponent} from './categories-management/categories-management.component';
import {UploadTemplateComponent} from './upload-template/upload-template.component';
import {StoredProductsManagementComponent} from './stored-products-management/stored-products-management.component';


const routes: Routes = [
  { path:  'management/categories', component:  CategoriesManagementComponent},
  { path:  'management/upload', component:  UploadTemplateComponent},
  { path:  'management/storedProducts', component:  StoredProductsManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ManagementRoutingModule { }
