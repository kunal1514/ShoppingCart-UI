import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/Category';
import { FileHandle } from 'src/app/models/file-handle';
import { Product } from 'src/app/models/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  addProductForm: FormGroup;

  categories: Category[] = [];

  selectedCategories: Category[] = [];

  product: Product;

  fileImage: FileHandle;

  formData = new FormData();

  constructor(private categoryService: CategoryService, 
              private productService: ProductService,
              private toaster: ToastrService,
              private sanitizer: DomSanitizer,
              private router: Router) { }

  ngOnInit(): void {
    this.addProductForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      unitsInStock: new FormControl('', Validators.required)
    })

    this.categoryService.getAllCategories().subscribe({
      next : (data) => {
        this.categories = data;
      }
    })
  }

  onFormSubmit() {
    this.product = {
      name: this.addProductForm.value.title,
      description: this.addProductForm.value.description,
      price: this.addProductForm.value.price,
      inShellStock: this.addProductForm.value.unitsInStock,
      currentStock: this.addProductForm.value.unitsInStock,
      category: this.selectedCategories,
      productImage: this.fileImage
    }

    console.log(this.product);

    const productFormData = this.prepareFormData(this.product);

    this.productService.addProduct(productFormData).subscribe({
      next : (data) => {
        this.toaster.success(data?.msg);
        this.addProductForm.reset();
        this.router.navigateByUrl("/");
      },
      error : (err) => {
        this.toaster.error(err.error.msg);
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
