import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../models/file-handle';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private sanitizer: DomSanitizer) { }

  public createImage(product: Product) {
    const productImage: any = product.productImage;

    const imageBlob = this.dataURItoBlob(productImage.picBytes, productImage.type);

    const imageFile = new File([imageBlob], productImage.name, {type: productImage.type});

    const fileHandle: FileHandle = {
      file : imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    }

    product.productImage = fileHandle;
    return product;
  }

  public dataURItoBlob(picBytes, imageType) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for(let i=0; i<byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], {type: imageType});

    return blob;
  }
}
