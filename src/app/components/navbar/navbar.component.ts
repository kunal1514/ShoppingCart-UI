import { Component, OnInit } from '@angular/core';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  cartCount : number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {

    this.cartService.cartCount$.subscribe({
      next : (data) => {
        this.cartCount = data;
        console.log(this.cartCount);
      }
    })
  }

}
