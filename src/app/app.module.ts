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
  DialogModule,
  FileUploadModule,
  FullCalendarModule, GalleriaModule,
  InputTextareaModule, MenuModule, MessageModule, OrderListModule, PaginatorModule, PanelMenuModule,
  RadioButtonModule, ScrollPanelModule, SidebarModule,
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
import {CookieService} from 'ngx-cookie-service';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { ShoppingCardComponent } from './shopping-card/shopping-card.component';
import { LoginComponent } from './profile/login/login.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { OrderDetailsComponent } from './profile/profile-details/order-details/order-details.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';

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
    ContactComponent,
    ProfileComponent,
    ShoppingCardComponent,
    LoginComponent,
    ProfileDetailsComponent,
    OrderDetailsComponent,
    ChangePasswordComponent,
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
    OrderListModule,
    DialogModule,
    ScrollPanelModule,
    GalleriaModule
  ],
  providers: [
    MessageService,
    UploadProductService,
    CookieService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
