import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {Product} from '../shared/models/Product';
import {LoadProductsService} from '../shared/services/load-products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnChanges {
  @Input() readonly product: Product;
  @Output() initEvent = new EventEmitter<string>();

  photos: any[];
  display = false;

  constructor(private loadProductsService: LoadProductsService) {
    this.photos = [];
  }

  ngOnInit(): void {
    this.initEvent.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.product !== undefined ) && (this.product.images !== undefined) && (this.product.images.length > 0)) {
      this.loadProductsService.getPhotos(this.product.images).subscribe(next => {
        this.photos.push(next.image.data);
      });
    }
  }


  goToDetailsPane(event: MouseEvent) {
    this.display = true;
  }
}
