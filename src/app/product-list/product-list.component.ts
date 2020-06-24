import {Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Product} from '../shared/models/Product';
import {NavigationEnd, Router} from '@angular/router';
import {LoadProductsService} from '../shared/services/load-products.service';
import * as $ from 'jquery';
import {Paginator, SelectItem} from 'primeng';
import {CategoriesService} from '../shared/services/categories.service';
import {Category} from '../shared/models/Category';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private category: string;
  @ViewChildren(Paginator) paginators: any;
  products: Product[];
  nameFilter: string;
  rangeValues: number[] = [undefined, undefined];
  subcategories: SelectItem[];
  selectedSubcategory: string;
  totalRecords = 0;
  sortingOptions: SelectItem[] = [
    {label: 'cena rosnąco', value: 'PA'}, // price asc
    {label: 'cena malejąco', value: 'PD'}, // price desc
    {label: 'nazwa a-z', value: 'NA'}, // name asc
    {label: 'nazwa z-a', value: 'ND'}, // name desc
    {label: 'ilość w magazynie', value: 'AD'}, // available number desc
  ];
  sortSelected: string;
  displayDetails = false;
  productToDetails: Product;
  photoToDetails: any;
  parentCategory: Category;

  private recursive = false;
  private page: number;
  private rows: number;

  constructor(private router: Router, private loadProductsService: LoadProductsService, private categoriesService: CategoriesService) {
    this.products = [];
    const subscription: Subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedSubcategory = undefined;
        const url: string[] = event.url.split('/');
        if (url.length >= 2 && url[1] === 'products') {
          this.parentCategory = undefined; // clean previous data
          this.subcategories = undefined;
          if (url.length > 2) {
            this.category = url[2];
            this.loadProducts({category: this.category, productsPerPage: this.paginators ? this.paginators._results[0].rows : 12});
            this.categoriesService.getParent(this.category).then(value => {
              if (value) {
                this.parentCategory = value;
              } else {
                this.parentCategory = new Category('/products', null, 'Wszystkie produkty');
              }
            });
            this.categoriesService.getChildren(this.category).then((value: Category[]) => {
              this.subcategories = [];
              value.forEach(value1 => {
                this.subcategories.push({label: value1.name, value: value1.id});
              });
            });
          } else {
            this.category = undefined;
            this.loadProducts({productsPerPage: this.paginators ? this.paginators._results[0].rows : 12});
            this.categoriesService.getBaseCategories().then((value: Category[]) => {
              this.subcategories = [];
              value.forEach(value1 => {
                this.subcategories.push({label: value1.name, value: value1.id});
              });
            });
          }
        } else {
          subscription.unsubscribe();
        }
      }
    });
  }

  loadProducts(params) {
    if (this.nameFilter) {
      params.name = this.nameFilter;
    }
    if (this.rangeValues[0]) {
      params.minPrice = this.rangeValues[0];
    }
    if (this.rangeValues[1]) {
      params.maxPrice = this.rangeValues[1];
    }
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

  changePage(event: any) {
    if (this.recursive) {
      this.recursive = false;
    } else {
      this.page = event.page;
      this.rows = event.rows;
      this.applySortOrFilter();
      for (const paginator of (this.paginators._results as Paginator[])) {
        paginator.rows = event.rows;
        if (paginator.getPage() !== event.page) {
          this.recursive = true;
          paginator.changePage(event.page);
        }
      }
    }
  }

  showDetails(event: any) {
    this.productToDetails = event.product;
    this.photoToDetails = event.photo;
    this.displayDetails = true;
  }

  changeName(event: Event) {
    this.nameFilter = (event.target as HTMLInputElement).value;
  }

  applySortOrFilter() {
    const params: any = {
      pageNumber: this.page ? this.page : 0,
      productsPerPage: this.rows ? this.rows : 12,
      sortingMethod: this.sortSelected ? this.sortSelected : '' };
    if (this.category) {
      params.category = this.category;
    }
    this.loadProducts(params);
  }
}

