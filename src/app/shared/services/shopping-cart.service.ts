import { Injectable } from '@angular/core';
import {Product} from '../models/Product';
import {ShoppingCartItem} from '../models/ShoppingCartItem';
import {ToastService} from './toast.service';
@Injectable({
  providedIn: 'root'})
export class ShoppingCartService {

  constructor(private toastService: ToastService) { }

  addProduct(product: Product, amount: number): number {
    let inCartProducts: ShoppingCartItem[] = JSON.parse(localStorage.getItem('productCart'));
    let newAmount = amount;
    if (inCartProducts) {
      const productInShoppingList = inCartProducts.find(value => value.id === product.id);
      if (productInShoppingList) {
        newAmount += productInShoppingList.amount;
        if (newAmount <= product.itemsNumber) {
          productInShoppingList.amount = newAmount;
        } else {
          return 0;
        }
      } else {
        if (amount <= product.itemsNumber) {
          inCartProducts.push({id: product.id, photoId: product.images[0], name: product.name, amount});
        } else {
          return 0;
        }
      }
    } else {
      if (amount <= product.itemsNumber) {
        inCartProducts.push({id: product.id, photoId: product.images[0], name: product.name, amount});
      } else {
        return 0;
      }
      inCartProducts = [{id: product.id, photoId: product.images[0], name: product.name, amount}];
    }
    localStorage.setItem('productCart', JSON.stringify(inCartProducts));
    return newAmount;
  }

  changeAmount(productId: string, newAmount: number) {
    const inCartProducts: ShoppingCartItem[] = JSON.parse(localStorage.getItem('productCart'));
    if (inCartProducts) {
      const index = inCartProducts.findIndex(value => value.id === productId);
      if (index !== -1) {
        if (newAmount !== 0) {
          inCartProducts[index].amount = newAmount;
        } else {
          inCartProducts.splice(index, 1);
        }
      }
    }
    localStorage.setItem('productCart', JSON.stringify(inCartProducts));
  }

  getShoppingCart(): ShoppingCartItem[] {
    return JSON.parse(localStorage.getItem('productCart'));
  }

  computeTotalPrice(prices: number[]) {
    return prices.reduce( (a, b) => a + b , 0);
  }
}
