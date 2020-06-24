import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Product} from '../models/Product';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'})
export class UploadProductService {
  constructor(private http: HttpClient, private toastService: ToastService) { }

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
}
