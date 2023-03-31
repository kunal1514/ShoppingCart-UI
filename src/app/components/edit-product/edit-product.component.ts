import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { FileHandle } from 'src/app/models/file-handle';
import { Product } from 'src/app/models/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  editProductForm : FormGroup;

  productId : number;

  product : Product;

  newProduct : Product;

  categories : Category[] = [];

  selectedCategories: any[] = [];

  fileImage: FileHandle;

  selectedValues: any[] = [];

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private categoryService: CategoryService,
              private imageService: ImageProcessingService,
              private sanitizer: DomSanitizer,
              private toaster: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    console.log(this.productId);

    this.productService.getProductbyId(this.productId)
    .pipe(
      map((product: Product) => this.imageService.createImage(product))
    )
    .subscribe({
      next : (data) => {
        this.product = data;
        console.log(data);
        this.selectedCategories = this.product.category;
        this.selectedValues = this.product.category.map(c => c.name);
        console.log(this.selectedCategories)
        this.fileImage = this.product.productImage;
      }
    })

    this.categoryService.getAllCategories().subscribe({
      next : (data) => {
        this.categories = data;
      }
    })

    this.editProductForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      unitsInStock: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    })
  }

  onFormSubmit() {
    this.newProduct = {
      name: this.editProductForm.value.title,
      description: this.editProductForm.value.description,
      price: this.editProductForm.value.price,
      inShellStock: this.editProductForm.value.unitsInStock,
      currentStock: this.editProductForm.value.unitsInStock,
      productImage: this.fileImage,
      category: this.selectedCategories
    }

    console.log(this.newProduct);

    const productFormData = this.prepareFormData(this.newProduct);

    this.productService.editProduct(productFormData, this.productId).subscribe({
      next : (data) => {
        this.toaster.success(data?.msg);
      },
      error : (err) => {
        this.toaster.error(err?.error?.msg)
        console.log(err);
      }
    })
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

  onFileSelected(event) {
    if(event.target.files) {
      const file: File = event.target.files[0];
      console.log(file);
      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      }
      console.log(fileHandle);
      this.fileImage = fileHandle;
    } 
    
  }

  selectedElements($event) {
    this.selectedCategories = $event;
    
  }

}
