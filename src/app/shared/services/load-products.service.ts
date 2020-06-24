import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/Product';
import {Page} from '../models/Page';
import {UserService} from './user.service';
import {Unit} from '../models/Unit';
@Injectable({
  providedIn: 'root'})
export class LoadProductsService {

  constructor(private http: HttpClient, private userService: UserService) { }

  getProducts(params?): Observable<Page<Product>> {
    return new Observable<Page<Product>>(subscriber => {
      this.http.get('/products/get', {params}).subscribe((data: Page<Product>) => {
        subscriber.next(data);
      });
    });
  }

  getDetailedProduct(id: string): Promise<Product> {
      return this.http.get<Product>('/products/details', {params: {id}}).toPromise();
  }

  getUnit(id: string): Promise<Unit> {
    return this.http.get<Unit>('/unit/get', {params: {id}}).toPromise();
  }

  getAllUnits(): Promise<Unit[]> {
    return this.http.get<Unit[]>('/unit/getAll').toPromise();
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
