import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  addProduct(product: FormData): Observable<any> {
    return this.http.post<any>(`${environment.serverurl}/add/product`, product);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.serverurl}/get/products`);
  }

  getProductbyId(productId: number): Observable<Product> {
    return this.http.get<Product>(`${environment.serverurl}/get/product/${productId}`);
  }

  editProduct(product: FormData, productId) : Observable<any> {
    return this.http.put<any>(`${environment.serverurl}/edit/product/${productId}`, product);
  }

  deleteProduct(productId: number) : Observable<any> {
    return this.http.delete<any>(`${environment.serverurl}/delete/product/${productId}`);
  }
}
