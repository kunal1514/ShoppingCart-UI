import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/models/CartItem';
import { FileHandle } from 'src/app/models/file-handle';
import { Order } from 'src/app/models/Order';
import { Product } from 'src/app/models/Product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {

  cartItems: Product[] = [];

  orderDetails: Order;

  orderPlaced: boolean = false;

  fileImage: FileHandle;

  msg: string;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartServiceService, 
              private orderService: OrderService,
              private productService: ProductService,
              private toaster: ToastrService,
              private router: Router,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.cartItems = this.cartService.cartItems;

    console.log(this.cartItems);

    this.cartService.totalPrice$.subscribe({
      next : (data) => {
        this.totalPrice = data;
      }
    })

    this.cartService.totalQuantity$.subscribe({
      next : (data) => {
        this.totalQuantity = data;
      }
    })

    this.cartService.computeCartTotals();

    console.log(`Total Price: ${this.totalPrice}  Total Quantity: ${this.totalQuantity}`);

  }

  prepareFormData(product: Product): FormData {
    const formData = new FormData();

    formData.append(
      'product',
      new Blob([JSON.stringify(product)], {type: 'application/json'})
    );

    formData.append(
      'imageFile',
      product.productImage.file,
      product.productImage.file.name
    );

    return formData;
  }

  placeOrder() {
    console.log(this.cartItems);
    this.orderDetails = {
      totalQuantity: this.totalQuantity,
      total_amt: this.totalPrice,
      products: this.cartItems
    }

    this.orderDetails.products.forEach(product => {
      const productFormData = this.prepareFormData(product);
      this.productService.addProduct(productFormData).subscribe({
        next : (data) => {
          console.log(data);
        },
        error : (err) => {
          console.log(err);
        }
      })
      console.log(product);
    })

    this.orderPlaced = true;
    this.cartService.isOrderPlaced.next(this.orderPlaced);

    this.orderService.placeOrder(this.orderDetails).subscribe({
      next : (data) => {
        this.msg = data.msg;
        this.toaster.success(this.msg);
        this.cartItems.splice(0, this.cartItems.length);
        this.router.navigateByUrl("/");
        this.cartService.cartCount$.next(0);
      },
      error : (err) => {
        this.msg = err.error.msg;
        this.toaster.error(this.msg);
      }
    })
  }

  incrementItemQuantity(cartItem: Product) {
    if(cartItem.currentStock > cartItem.quantity) {
      this.cartService.addToCart(cartItem);
    } else {
      this.toaster.error("Total units in stock reached its limit");
    }
  }

  decrementItemQuantity(cartItem: Product) {
    cartItem.quantity--;
    if(cartItem.quantity === 0) {
      console.log("In if statement")
      this.cartService.removeItem(cartItem);
    } else {
      console.log(this.cartItems);
      this.cartService.computeCartTotals();
    }
  }

  remove(cartItem: Product) {
    this.cartService.removeItem(cartItem);
    this.toaster.success("Product removed from the Cart Successfully");
  }

}
