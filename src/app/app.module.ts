import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MenubarModule } from 'primeng/menubar';
import { NavbarComponent } from './navbar/navbar.component';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { UploadTemplateComponent } from './management-pane/upload-template/upload-template.component';
import {
    FileUploadModule,
    FullCalendarModule,
    InputTextareaModule, MenuModule, MessageModule, OrderListModule, PaginatorModule, PanelMenuModule,
    RadioButtonModule, SidebarModule,
    TreeModule
} from 'primeng';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {UploadProductService} from './shared/services/upload-product.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ManagementPaneComponent } from './management-pane/management-pane.component';
import { CategoriesManagementComponent } from './management-pane/categories-management/categories-management.component';
import { StoredProductsManagementComponent } from './management-pane/stored-products-management/stored-products-management.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ImageOrderComponent } from './management-pane/upload-template/image-order/image-order.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductListComponent,
    NavbarComponent,
    UploadTemplateComponent,
    ManagementPaneComponent,
    CategoriesManagementComponent,
    StoredProductsManagementComponent,
    ProductDetailsComponent,
    ImageOrderComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MenubarModule,
        InputTextModule,
        ButtonModule,
        InputTextareaModule,
        FullCalendarModule,
        FileUploadModule,
        HttpClientModule,
        FormsModule,
        RadioButtonModule,
        TreeModule,
        ToastModule,
        BrowserAnimationsModule,
        PanelMenuModule,
        MenuModule,
        PaginatorModule,
        InputNumberModule,
        MessageModule,
        SidebarModule,
        OrderListModule
    ],
  providers: [
    MessageService,
    UploadProductService,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
