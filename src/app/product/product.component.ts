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
  @Output() showDetails = new EventEmitter<any>();

  photo: any;

  constructor(private loadProductsService: LoadProductsService) {}

  ngOnInit(): void {
    this.initEvent.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.product !== undefined ) && (this.product.images !== undefined) && (this.product.images.length > 0)) {
      this.loadProductsService.getPhotos([this.product.images[0]]).subscribe(next => {
        this.photo = next.image.data;
      });
    }
  }


  goToDetailsPane(event: MouseEvent) {
    this.showDetails.emit({product: this.product, photo: this.photo});
  }
}
