import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastService} from '../../shared/services/toast.service';
import {UploadProductService} from '../../shared/services/upload-product.service';
import {FileUpload, TreeNode} from 'primeng';
import {CategoriesService} from '../../shared/services/categories.service';
import {Observable} from 'rxjs';
import {Category} from '../../shared/models/Category';
import {Product} from '../../shared/models/Product';
import {MenuItem} from 'primeng/api';
import {NodeEventHandler} from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'app-upload-template',
  templateUrl: './upload-template.component.html',
  styleUrls: ['./upload-template.component.scss'],
})
export class UploadTemplateComponent implements OnInit {
  @ViewChild('fileUpload', {static: false, read: false} ) private fileUpload: FileUpload;

  categoriesTree: TreeNode[] = [];
  selectedCategory: TreeNode;
  productName: string;
  price = '0';
  itemsNumber = '1';
  unit = 'szt.';
  shortDescription: string;
  description: string;
  dimensions: string;
  weight: string;

  // tslint:disable-next-line:max-line-length
  constructor(private toastService: ToastService, private uploadService: UploadProductService, private categoriesService: CategoriesService) {}

  ngOnInit() {
    const categories: Promise<Category[]> = this.categoriesService.getCategories();
    console.log('init');
    categories.then(data => {
      this.createCategoriesTree(data);
    });
    categories.catch(() =>  this.toastService.error('Nie udało się załadować kategorii'));
    categories.finally(() => {
      this.categoriesTree.push({styleClass: 'inputNode', children: []});
      this.insertInputChildren();
    });
  }

  private insertInputChildren() {
    this.categoriesTree.forEach(node => node.children.push({styleClass: 'inputNode', children: []}));
  }

  private createCategoriesTree(categories: Category[]) {
    while (categories.length > 0) {
      for ( let i = 0; i < categories.length; i++ ) {
        if (this.addCategory(categories[i])) {
          categories.splice(i, 1);
          i--;
        }
      }
    }
  }

  private hasCategory(elements: TreeNode[], parentID: string): TreeNode {
    for (const item of elements) {
      if (item.key === parentID) {
        return item;
      } else {
        if (item.children !== undefined) {
          const returnedElement: MenuItem = this.hasCategory(item.children, parentID);
          if (returnedElement !== undefined) {
            return returnedElement;
          }
        }
      }
    }
  }

  private addCategory(cat: Category): boolean {
    let newItem: TreeNode;
    if (cat.parentId === null) {
      newItem = {label: cat.name, children: [], key: cat.id};
      this.categoriesTree.push(newItem);
      return true;
    }
    const parentItem: TreeNode = this.hasCategory(this.categoriesTree, cat.parentId);
    if (parentItem !== undefined) {
      newItem = {label: cat.name, children: [], key: cat.id};
      parentItem.children.push(newItem);
      return true;
    }
    return  false;
  }

  addInputNodes(event) {
    event.node.children.forEach((child: TreeNode) => {
      child.children.push({styleClass: 'inputNode', children: []});
    });
  }

  removeInputNodes(event: any) {
    event.node.children.forEach((child: TreeNode) => {
      this.removeInputNodesRecursively(child);
    });
  }

  private removeInputNodesRecursively(node: TreeNode) {
    if (node.expanded === true) {
      node.children.forEach((child: TreeNode) => {
        this.removeInputNodesRecursively(child);
      });
      node.expanded = false;
    }
    node.children.pop();
  }

  private errorCategoryWasDeleted(reason: string) {
    this.toastService.error(reason);
  }

  private uploadCategories(node: TreeNode): Promise<string> {
    return new Promise<string>( (resolve, reject) => {
      if (node.styleClass === undefined) {
        resolve(node.key);
      } else if (node.parent === undefined) {
        this.uploadService.addNewCategory(node.label).then(data => resolve(data)).catch(reason => reject(reason));
      } else {
        this.uploadCategories(node.parent).then(data => {
          this.uploadService.addNewCategory(node.label, data).then(data2 => resolve(data2)).catch(reason => reject(reason));
        }).catch(reason => reject(reason));
      }
    });
  }

  uploadProduct($event: any) {
    if (this.checkDataCorrectness()) {
      const categoriesPromise = this.uploadCategories(this.selectedCategory).then(next => {
        const categoryID = next;
        const photosIDs: string[] = [];
        // tslint:disable-next-line:max-line-length
        const completedProduct = new Product(this.productName, parseFloat(this.price), this.description, [], parseFloat(this.itemsNumber), this.dimensions, this.weight, categoryID);
        if (this.fileUpload._files.length > 0) {
          this.uploadAllPhotos().subscribe(newID => photosIDs.push(newID),
            () => {},
            () => {
              completedProduct.images = photosIDs;
              this.uploadWholeProduct(completedProduct);
            });
        } else {
          this.uploadWholeProduct(completedProduct);
        }
      });
      categoriesPromise.catch(reason => this.errorCategoryWasDeleted(reason));
    }
  }

  private uploadWholeProduct(product: Product): void {
    this.uploadService.uploadProduct(product).subscribe(() => this.toastService.success('Zapisano'));
  }

  private uploadAllPhotos(): Observable<string> {
    return new Observable<string>( observer => {
      let i = 0;
      for (const file of this.fileUpload._files) {
        this.uploadService.getFileID(file).subscribe( next => {
          observer.next(next);
          i += 1;
          if (i === this.fileUpload._files.length) {
            observer.complete();
          }
        });
      }
    });
  }

  private checkDataCorrectness(): boolean {
    if (this.productName === undefined || this.productName.length < 3) {
      this.toastService.error('Zbyt krótka nazwa produktu (co najmniej 3 znaki)');
      return false;
    }

    // check if category is correct
    if (this.selectedCategory === undefined) {
      this.toastService.error('Nie wybrano kategorii');
      return false;
    }
    if (this.selectedCategory.label === undefined) {
      this.toastService.error('Nie podano nazwy kategorii');
      return false;
    }
    // tslint:disable-next-line:max-line-length
    if (this.selectedCategory.parent !== undefined && this.selectedCategory.parent !== null && this.selectedCategory.parent.label === undefined) {
      this.toastService.error('Nie podano nazwy kategorii nadrzędnej');
      return false;
    }

    if ( this.price === undefined || !this.price.match('^[0-9]+\.{0,1}[0-9]{0,2}$') || parseFloat(this.price) === 0) {
      this.toastService.error('Cena powinna być liczbą dodatnią, maksymalnie dwa miejsca po przecinku');
      return false;
    }
    if (this.itemsNumber === undefined || !this.itemsNumber.match('^[0-9]+\.*[0-9]*$')) {
      this.toastService.error('Dostępna ilość powinna być liczbą nieujemną');
      return false;
    }
    return true;
  }

}
