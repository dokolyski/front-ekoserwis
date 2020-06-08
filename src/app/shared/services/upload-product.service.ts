import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Product} from '../models/Product';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'})
export class UploadProductService {
  constructor(private http: HttpClient, private toastService: ToastService) { }

  addNewCategory(name: string, parent?: string): Promise<string>  {
      const formData = new FormData();
      formData.append('name', name);
      if (parent !== undefined) {
        formData.append('parentId', parent);
      }
      return this.http.post('/categories/add', formData, { responseType: 'text'}).toPromise();
  }

  uploadPhoto(file: File): Observable<string> {
    return new Observable<string>(subscriber => {
      const formData: FormData = new FormData();
      formData.append('file', file);
      // TODO progress monitoring
      this.http.post('/photos/add', formData, { responseType: 'text'}).subscribe(data => {
        this.toastService.info(`Przesłano plik: ${file.name}`);
        subscriber.next(data);
      }, error => {
        this.toastService.error(error);
      });
    });
  }

  uploadProduct(product: Product): Observable<Product>  {
    return new Observable<Product>(subscriber => {
      this.http.post('/products/add', product).subscribe((data: Product) => {
        subscriber.next(data);
      }, error => {
        this.toastService.error(error);
      });
    });
  }

  // todo test it!
  actualizeProduct(product: Product): Observable<string>  {
    return new Observable<any>(subscriber => {
      this.http.put('/products/set', product, { responseType: 'text'}).subscribe(data => {
        subscriber.next(data);
      }, error => {
        this.toastService.error(error);
      });
    });
  }
}
