import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'})
export class CategoriesService {

  constructor(private https: HttpClient) { }

  getCategories(): Promise<any> {
    return this.https.get('/categories/get').toPromise();
  }
}
