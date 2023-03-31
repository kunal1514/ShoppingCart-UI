import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { HomeComponent } from './components/home/home.component';
import { ProductCartComponent } from './components/product-cart/product-cart.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AddProductComponent,
    HomeComponent,
    ProductCartComponent,
    ProductDetailsComponent,
    OrderDetailsComponent,
    InventoryComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
