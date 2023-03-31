import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(order: Order) : Observable<any> {
    return this.http.post<any>(`${environment.serverurl}/add/order`, order);
  }

  getAllOrders() : Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.serverurl}/get/orders`);
  }
}
