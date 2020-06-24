import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Product} from '../shared/models/Product';
import {LoadProductsService} from '../shared/services/load-products.service';
import {Unit} from '../shared/models/Unit';
import {ShoppingCartService} from '../shared/services/shopping-cart.service';
import {ToastService} from '../shared/services/toast.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnChanges {
  @Input() product: Product;
  photos: any[];
  i: number;
  unit: Unit;
  amount: number;
  display: boolean;

  constructor(private loadProductsService: LoadProductsService,
              public shoppingCartService: ShoppingCartService,
              private toastService: ToastService) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.display = false;
    if (this.product !== undefined) {
      if (changes.product.previousValue === undefined || changes.product.previousValue.id !== this.product.id) {
        this.i = 0;
        this.loadProductsService.getDetailedProduct(this.product.id).then(value => {
          this.product = value;
        });
        this.photos = new Array(this.product.images.length);
        this.loadProductsService.getPhotos(this.product.images).subscribe(next => {
          this.photos[this.product.images.indexOf(next.id)] = next.image.data;
        });
        console.log(this.product.unitId);
        if (this.product.unitId) {
          console.log(this.product.unitId);
          this.loadProductsService.getUnit(this.product.unitId).then(value => {
            console.log(value.name);
            this.unit = value;
          });
        }
      }
    }
  }

  changeImg(n: number) {
    this.i += n;
  }

  photoClicked(event: MouseEvent) {
    const clickableWidth = 80;
    if (event.offsetX < clickableWidth) {
      if (this.i > 0) {
        this.i--;
      }
    } else if (event.offsetX > ( parseFloat($('.big-image').css('width')) - clickableWidth)) {
      if (this.i < this.photos.length - 1) {
        this.i++;
      }
    }
  }

  scrollToFullDescription() {
    $('.fullDescription-details').get()[0].scrollIntoView({behavior: 'smooth'});
  }

  addProductToCart() {
    if (this.unit.isInteger) {
      const addItem = this.shoppingCartService.addProduct(this.product, 1);
      if (addItem) {
        this.addItemOK(addItem);
      } else {
        this.addItemWrong();
      }
    } else {
      this.amount = 1;
      this.display = true;
    }
  }

  cancel() {
    this.toastService.info(`Anulowano dodanie produktu do koszyka`);
    this.display = false;
  }

  accept() {
    if (this.amount > 0) {
      const addItem = this.shoppingCartService.addProduct(this.product, this.amount);
      if (addItem) {
        this.addItemOK(addItem);
        this.display = false;
      } else {
        this.addItemWrong();
      }
    } else {
      this.toastService.warn(`Podana ilość (${this.product.itemsNumber}) powinna być większa od zera`);
    }
  }

  private addItemOK(amount: number) {
    this.toastService.success(`Dodano produkt ${this.product.name}, w koszyku jest ${amount}${this.unit.name} tego produktu`);
  }

  private addItemWrong() {
    this.toastService.error(`Nie można dodać tego produktu, gdyż jego ilość w koszyku
         przekroczyła by dostępną ilość (${this.product.itemsNumber}${this.unit.name}).
         Wybierz mniejszą ilość, bądź skontaktuj się z nami aby osobiście ustalić możliwość sprzedaży tego produktu`);
  }
}
