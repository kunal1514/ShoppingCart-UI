import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Order } from 'src/app/models/Order';
import { OrderDetails } from 'src/app/models/OrderDetails';
import { Product } from 'src/app/models/Product';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orders: OrderDetails[]

  constructor(private orderService: OrderService, private imageService: ImageProcessingService) { }

  ngOnInit(): void {
    this.orderService.getAllOrders()
    .subscribe({
      next : (data) => {
        this.orders = data;
        console.log(this.orders);
      }
    })
  }

}
