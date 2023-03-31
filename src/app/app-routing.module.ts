import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { HomeComponent } from './components/home/home.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ProductCartComponent } from './components/product-cart/product-cart.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: HomeComponent},
  {path: 'add/product', component: AddProductComponent},
  {path: 'product/cart', component: ProductCartComponent},
  {path: 'product/details/:id', component: ProductDetailsComponent},
  {path: 'order/details', component: OrderDetailsComponent},
  {path: 'products/inventory', component: InventoryComponent},
  {path: 'edit/product/:id', component: EditProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
