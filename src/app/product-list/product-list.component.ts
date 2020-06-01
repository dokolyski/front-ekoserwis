import {Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Product} from '../shared/models/Product';
import {NavigationEnd, Router} from '@angular/router';
import {LoadProductsService} from '../shared/services/load-products.service';
import * as $ from 'jquery';
import {Paginator, SelectItem} from 'primeng';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @ViewChildren(Paginator) paginators: any;
  products: Product[];
  rangeValues: number[] = [undefined, undefined];
  subcategories: string[];
  selectedSubcategory: string;
  rowNumber = 12;
  totalRecords = 0;
  sortingOptions: SelectItem[] = [
    {label: 'najczęściej kupowane', value: 'BS'}, // best seller
    {label: 'cena rosnąco', value: 'PA'}, // price asc
    {label: 'cena malejąco', value: 'PD'}, // price desc
    {label: 'nazwa a-z', value: 'NA'}, // name asc
    {label: 'nazwa z-a', value: 'ND'}, // name desc
    {label: 'ilość w magazynie', value: 'AD'}, // available number asc
  ];
  sortSelected: string;

  constructor(private router: Router, private loadProductsService: LoadProductsService) {
    this.products = [];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url: string[] = event.url.split('/'); // todo filters
        const category: string = url.length > 2 ? url[2] : undefined;
        if (category !== undefined) {
          console.log(category);
          loadProductsService.getProducts({category, productsPerPage: this.rowNumber}).subscribe(next => {
            this.products = next.content;
          });
        }
      }
    });
  }

  loadProducts(params) {
    this.loadProductsService.getProducts(params).subscribe(next => {
      this.products = next.content;
      this.totalRecords = next.totalElements;
    });
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize);
  }

  onResize() {
    const width: number = $('.box').width();
    $('.productName').css('fontSize', `${width / 15}px`);
    $('.description').css('fontSize', `${width / 20}px`);
    $('.price').css('fontSize', `${width / 10}px`);
  }

  checkHasProperNumber(newValue: string) {
      if ( newValue !== '' && !newValue.match('^[0-9]+\.{0,1}[0-9]{0,2}$')) {
        // this.toastService.error('Cena powinna być liczbą dodatnią, maksymalnie dwa miejsca po przecinku');
        return false;
      }
  }

  changePage(event: any) {
    for (const paginator of (this.paginators._results as Paginator[])) {
      paginator.rows = event.rows;
      if (paginator.getPage() !== event.page) {
        paginator.changePage(event.page);
      }
    }
  }
}

