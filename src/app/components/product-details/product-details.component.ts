import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productId: number;
  product: Product;
  cartItem: Product;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private imageService: ImageProcessingService,
              private cartService: CartServiceService,
              private toaster: ToastrService) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.productService.getProductbyId(this.productId)
    .pipe(
      map((product: Product) => this.imageService.createImage(product))
    )
    .subscribe({
      next : (data) => {
        this.product = data;
      }
    })
  }

  addToCart() {
    this.cartItem = {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      quantity: 1,
      inShellStock: this.product.inShellStock,
      currentStock: this.product.currentStock,
      category: this.product.category,
      dateCreated: this.product.dateCreated,
      productImage: this.product.productImage
    }

    if(this.product.currentStock === 0) {
      this.toaster.error("Product is currently Out of Stock");
    } else {
      this.cartService.addToCart(this.cartItem);
      this.toaster.success("Product added in the Cart Successfully")
    }
  }

}
