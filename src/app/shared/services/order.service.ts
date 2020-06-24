import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserService} from './user.service';
import {ShoppingCartItem} from '../models/ShoppingCartItem';
import {ShoppingCartService} from './shopping-cart.service';
@Injectable({
  providedIn: 'root'})
export class OrderService {

  constructor(private http: HttpClient, private userService: UserService, private shoppingCartService: ShoppingCartService) {
  }

  getOrders(page: number) {
    return this.http.get('/orders/get', {params: {page: page.toString()}}).toPromise();
  }

  makeOrder() {
    const items = this.shoppingCartService.getShoppingCart();

  }
}
