import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/Product';
import {Page} from '../models/Page';
@Injectable({
  providedIn: 'root'})
export class LoadProductsService {

  constructor(private http: HttpClient) { }

  getProducts(params?): Observable<Page<Product>> {
    return new Observable<Page<Product>>(subscriber => {
      this.http.get('/products/get', {params}).subscribe((data: Page<Product>) => {
        subscriber.next(data);
      });
    });
  }

  getPhotos(ids: string[]): Observable<any> {
    return new Observable<any>(subscriber => {
      for (const id of ids) {
        this.http.get('/photos/get', {params: {id}}).subscribe(data => {
          subscriber.next(data);
        });
      }
    });
  }
}
