import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  products: Product[];

  constructor(private productService: ProductService,
              private imageService: ImageProcessingService,
              private toaster: ToastrService) { }

  ngOnInit(): void {
    this.productService.getAllProducts()
    .pipe(
      map((x: Product[], i) => x.map((product: Product) => this.imageService.createImage(product)))
    )
    .subscribe({
      next : (data) => {
        this.products = data;
        console.log(this.products);
      }
    })
  }

  removeProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next : (data) => {
        this.toaster.success(data?.msg);
      },
      error : (err) => {
        this.toaster.error(err?.error?.msg);
        console.log(err);
      }
    })
    this.products = this.products.filter(p => p.id !== productId);
  }

}
