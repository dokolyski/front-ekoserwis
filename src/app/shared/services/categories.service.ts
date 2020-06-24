import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'})
export class CategoriesService {

  constructor(private https: HttpClient) { }

  getCategories(): Promise<any> {
    return this.https.get('/categories/get').toPromise();
  }

  getParent(id: string): Promise<any> {
    return this.https.get('/categories/parent', {params: {id}}).toPromise();
  }

  getChildren(id: string): Promise<any> {
    return this.https.get('/categories/children', {params: {id}}).toPromise();
  }

  getBaseCategories(): Promise<any> {
    return this.https.get('/categories/baseCategories').toPromise();
  }

  remove(id: string): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('id', id);
    return this.https.post('/categories/remove', formData).toPromise();
  }

  addNewCategory(name: string, parent?: string): Promise<string>  {
    const formData = new FormData();
    formData.append('name', name);
    if (parent !== undefined) {
      formData.append('parentId', parent);
    }
    return this.https.post('/categories/add', formData, { responseType: 'text'}).toPromise();
  }

  rename(newName: string, id: string): Promise<any> {
    const formData = new FormData();
    formData.append('newName', newName);
    if (parent !== undefined) {
      formData.append('id', id);
    }
    return this.https.post('/categories/rename', formData).toPromise();
  }
}
