import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../models/CartItem';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  cartItems: Product[] = [];

  totalPrice$ = new Subject<number>();
  totalQuantity$ = new Subject<number>();
  cartCount$ = new Subject<number>();
  isOrderPlaced = new Subject<boolean>();
  orderPlaced: boolean = false;
  cartItemCount: number = 0;

  constructor() { 
    this.isOrderPlaced.subscribe({
      next : (data) => {
        this.orderPlaced = data;
        if(this.orderPlaced === true) {
          this.cartItemCount = 0;
        }
      }
    })
   }

  addToCart(cartItem: Product) {
    let alreayExistsInCart: boolean = false;
    let existingCartItem: Product = undefined;

    if(this.cartItems.length > 0) {
      
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);

      alreayExistsInCart = (existingCartItem != undefined);
    }

    if(alreayExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
      this.cartItemCount = this.cartItemCount + 1;
      this.cartCount$.next(this.cartItemCount);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue = totalPriceValue + currentCartItem.quantity * currentCartItem.price;
      totalQuantityValue = totalQuantityValue + currentCartItem.quantity;
    }

    this.totalPrice$.next(totalPriceValue);
    this.totalQuantity$.next(totalQuantityValue);

    console.log(`Total Price: ${totalPriceValue}  Total Quantity: ${totalQuantityValue}`);
  }

  removeItem(cartItem: Product) {
    const itemIndex = this.cartItems.findIndex(item => {
      item.id === cartItem.id
    })
    if(itemIndex == -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
      this.cartItemCount = this.cartItemCount - 1;
      this.cartCount$.next(this.cartItemCount);
    }
  }
}
