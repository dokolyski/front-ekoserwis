import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LoadProductsService} from '../../../shared/services/load-products.service';
import {Product} from '../../../shared/models/Product';
import {UploadProductService} from '../../../shared/services/upload-product.service';

@Component({
  selector: 'app-image-order',
  templateUrl: './image-order.component.html',
  styleUrls: ['./image-order.component.scss']
})
export class ImageOrderComponent implements OnInit, OnChanges {
  @Input() product: Product;
  @Output() endOrder = new EventEmitter<void>();
  photos: any[] = [];

  constructor(private loadProductsService: LoadProductsService, private uploadProductService: UploadProductService) {}

  ngOnInit() {}

  confirmOrder() {
    this.product.images = Array.from(this.photos, x => x.id);
    this.uploadProductService.uploadProduct(this.product).subscribe(next => {
      this.endOrder.emit();
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.loadProductsService.getPhotos(this.product.images).subscribe(next => {
        this.photos.push(next);
      });
    }
  }
}
