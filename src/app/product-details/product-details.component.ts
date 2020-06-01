import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../shared/models/Product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @Input() readonly product: Product;
  @Input() readonly photos: any[];

  constructor() { }

  ngOnInit() {
  }

}
