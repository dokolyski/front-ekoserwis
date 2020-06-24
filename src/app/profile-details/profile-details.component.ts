import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {HttpResponse} from '@angular/common/http';
import {Order} from '../shared/models/Order';
import {Page} from '../shared/models/Page';
import {OrderService} from '../shared/services/order.service';
import {ShoppingCartItem} from '../shared/models/ShoppingCartItem';
import {ShoppingCartService} from '../shared/services/shopping-cart.service';
import {LoadProductsService} from '../shared/services/load-products.service';
import {Product} from '../shared/models/Product';
import {ToastService} from '../shared/services/toast.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
  email: string;
  orders: Order[];
  totalRecords: number;
  items: ShoppingCartItem[];
  visibleItems: ShoppingCartItem[];
  itemsPage = 0;
  totalPrice: number;
  displayDetails = false;
  productToDetails: Product;
  pageItems = 0;
  editedAmount: string;
  newAmount: number;

  constructor(private router: Router,
              private userService: UserService,
              private orderService: OrderService,
              private shoppingCartService: ShoppingCartService,
              private loadProductsService: LoadProductsService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.userService.getProfile().catch(() => {
      this.router.navigate(['login']);
    }).then((response: HttpResponse<Page<Order>>) => {
      this.email = response.headers.get('email');
      this.orders = response.body.content;
      this.loadItems();
    });
  }

  loadItems() {
    this.items = this.shoppingCartService.getShoppingCart();
    if (this.items) {
      this.setVisibleItems();
      this.items.forEach(value => {
        this.loadProductsService.getPhotos([value.photoId]).subscribe(next => {
          this.items[this.items.findIndex( value1 => value1.photoId === next.id)].photo = next.image.data;
        });
        this.totalPrice = 0;
        this.loadProductsService.getDetailedProduct(value.id).then(next => {
          const index = this.items.findIndex( value1 => value1.id === next.id);
          this.items[index].unitPrice = next.price;
          this.items[index].price = next.price * this.items[index].amount;
          this.totalPrice += this.items[index].price;
        });
      });
    } else {
      this.items = [];
    }
  }

  changeOrdersPage(event) {
    this.orderService.getOrders(event.page);
  }

  showDetails(item: ShoppingCartItem) {
    this.loadProductsService.getDetailedProduct(item.id).then(value => {
      this.productToDetails = value;
      this.displayDetails = true;
    });
  }

  changeItemsNumber() {

  }

  deleteItem(event: MouseEvent, itemId: string) {
    event.stopPropagation();
    this.shoppingCartService.changeAmount(itemId, 0);
    const index = this.items.findIndex(value => itemId === value.id);
    this.totalPrice -= this.items[index].price;
    this.items.splice(index, 1);
    this.setVisibleItems();
  }

  changeShoppingPage(event: any) {
    this.itemsPage = event.page;
    this.setVisibleItems();
  }

  private setVisibleItems() {
    this.visibleItems = this.items.slice(
      this.pageItems * 6,
      this.items.length <= (this.pageItems + 1) * 6 ? this.items.length : (this.pageItems + 1) * 6);
  }

  editAmount(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.editedAmount = id;
    const index = this.items.findIndex( value => value.id === id);
    this.newAmount = this.items[index].amount;
    // this.isInteger = this.items[index].unit.isInteger; todo - add integer and no integer service
    $('.amount-input').focus();
  }

  makeOrder() {

  }

  logOut() {
    this.userService.logout();
    this.toastService.success('Wylogowano');
    this.router.navigate(['login']);
  }
}
