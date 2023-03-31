import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { map, tap } from 'rxjs/operators';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ProductService } from 'src/app/services/product.service';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/Category';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/models/CartItem';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'src/app/models/file-handle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cartItem: Product;
  cartItem1: CartItem;
  products: Product[] = [];
  tempProducts: Product[] = [];
  categories: Category[] = [];

  constructor(private productService: ProductService, 
              private imageService: ImageProcessingService,
              private categoryService: CategoryService,
              private cartService: CartServiceService,
              private toaster: ToastrService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.productService.getAllProducts()
    .pipe(
      map((x: Product[], i) => x.map((product: Product) => this.imageService.createImage(product)))
    )
    .subscribe({
      next : (data) => {
        console.log(data);
        this.products = data;
        this.tempProducts = [...this.products];
      },
      error : (err) => {
        console.log(err);
      }
    })

    this.categoryService.getAllCategories().subscribe({
      next : (data) => {
        this.categories = data;
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  addToCart(productId: number) {
    this.productService.getProductbyId(productId)
    .pipe(
      map((product: Product) => this.imageService.createImage(product))
    )
    .subscribe({
      next : async (data) => {
        this.cartItem = data;
        const file : File = this.cartItem.productImage.file;
        const fileHandle: FileHandle = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          )
        }
        console.log(fileHandle);
        this.cartItem = {
          id: this.cartItem.id,
          name: this.cartItem.name,
          description: this.cartItem.description,
          price: this.cartItem.price,
          quantity: 1,
          inShellStock: this.cartItem.inShellStock,
          currentStock: this.cartItem.currentStock,
          category: this.cartItem.category,
          dateCreated: this.cartItem.dateCreated,
          productImage: this.cartItem.productImage
        }
        if(this.cartItem.currentStock === 0) {
          this.toaster.error("Product is currently Out of Stock");
        } else {
          this.cartService.addToCart(this.cartItem);
          this.toaster.success("Product added in the Cart Successfully")
        }
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  onChange(event: any) {
    const categoryName = event.target.value;
    if(categoryName !== '') {
      this.products = this.tempProducts;
      this.products = this.products.filter(p => {
        return p.category.find(c => c.name == categoryName)
      })
    } else {
      this.products = this.tempProducts;
    }
  }

}
function convertDataURIToBinary(dataURI): any {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
}

