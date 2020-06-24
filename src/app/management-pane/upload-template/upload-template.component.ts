import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ToastService} from '../../shared/services/toast.service';
import {UploadProductService} from '../../shared/services/upload-product.service';
import {FileUpload, SelectItem, TreeNode} from 'primeng';
import {CategoriesService} from '../../shared/services/categories.service';
import {Observable} from 'rxjs';
import {Category} from '../../shared/models/Category';
import {Product} from '../../shared/models/Product';
import {MenuItem} from 'primeng/api';
import {LoadProductsService} from '../../shared/services/load-products.service';
import {Unit} from '../../shared/models/Unit';
import {Router} from '@angular/router';
import {CategoriesTreeService} from '../../shared/services/categories-tree.service';

@Component({
  selector: 'app-upload-template',
  templateUrl: './upload-template.component.html',
  styleUrls: ['./upload-template.component.scss'],
})
export class UploadTemplateComponent implements OnInit, OnChanges {
  @ViewChild('fileUpload', {static: false, read: false} ) private fileUpload: FileUpload;

  @Input() inputProduct: Product;
  @Input() edit: boolean;

  categoriesTree: TreeNode[] = [];
  selectedCategory: TreeNode;
  displayImagesOrder = false;
  photosIDs: string[] = [];
  product: Product;
  units: Unit[];
  selectedUnit: Unit;
  categoriesTreeService: CategoriesTreeService;


  constructor(private toastService: ToastService,
              private uploadService: UploadProductService,
              private categoriesService: CategoriesService,
              private loadProductsService: LoadProductsService,
              private router: Router) {}

  ngOnInit() {
    this.categoriesTreeService = new CategoriesTreeService(this.toastService, this.categoriesService);
    this.categoriesTreeService.getDataAndFormat().then(data => {
      this.categoriesTree = data;
      if (this.inputProduct) {
        this.selectedCategory = this.findInTree(this.inputProduct.category, this.categoriesTree);
      }
    });
    this.loadProductsService.getAllUnits().then(value => {
      value.sort((a, b) => a.name <= b.name ? -1 : 1);
      this.units = value;
      if (this.inputProduct) {
        this.selectedUnit = this.units.find(value1 => this.inputProduct.unitId === value1.id);
      }
      });
    this.inputProduct = {category: '', images: [], itemsNumber: 0, name: '', price: 0, unitId: ''};
  }

  ngOnChanges(): void {
    if (this.inputProduct) {
      this.selectedCategory = this.findInTree(this.inputProduct.category, this.categoriesTree);
      this.selectedUnit = this.units[this.units.findIndex(value1 => this.inputProduct.unitId === value1.id)];
    } else {
      this.inputProduct = {category: '', images: [], itemsNumber: 0, name: '', price: 0, unitId: ''};
    }
  }

  private findInTree(id: string, nodes: TreeNode[]): TreeNode {
    for (const node of nodes) {
      console.log(node.key);
      if (node.key === id) {
        if (node.parent) {
          node.parent.expanded = true;
        }
        return node;
      } else if (node.children) {
        const result = this.findInTree(id, node.children);
        if (result) {
          if (node.parent) {
            node.parent.expanded = true;
          }
          node.expanded = true;
          return result;
        }
      }
    }
  }

  private errorCategoryWasDeleted(reason: string) {
    this.toastService.error(reason);
  }

  private uploadCategories(node: TreeNode): Promise<string> {
    return new Promise<string>( (resolve, reject) => {
      if (node.styleClass === undefined) {
        resolve(node.key);
      } else if (node.parent === undefined) {
        this.categoriesService.addNewCategory(node.label).then(data => resolve(data)).catch(reason => reject(reason));
      } else {
        this.uploadCategories(node.parent).then(data => {
          this.categoriesService.addNewCategory(node.label, data).then(data2 => resolve(data2)).catch(reason => reject(reason));
        }).catch(reason => reject(reason));
      }
    });
  }

  uploadProduct(event: any) {
    if (this.checkDataCorrectness()) {
      this.inputProduct.unitId = this.selectedUnit.id;
      const categoriesPromise = this.uploadCategories(this.selectedCategory).then(next => {
        this.inputProduct.category = next;
        this.photosIDs = [];
        if (this.fileUpload._files.length > 0) {
          this.uploadAllPhotos().subscribe(newID => this.photosIDs.push(newID),
            () => {},
            () => {
              this.inputProduct.images = this.photosIDs;
              this.uploadWholeProduct(this.inputProduct);
            });
        } else {
          this.uploadWholeProduct(this.inputProduct);
        }
      });
      categoriesPromise.catch(reason => this.errorCategoryWasDeleted(reason));
    }
  }

  private uploadWholeProduct(product: Product): void {
    this.uploadService.uploadProduct(product).subscribe(next => {
      this.toastService.success('Zapisano');
      if (next.images.length > 1) {
        this.product = next;
        this.displayImagesOrder = true;
      } else {
        this.goBackToManagement();
      }
    });
  }

  private uploadAllPhotos(): Observable<string> {
    return new Observable<string>( observer => {
      let i = 0;
      for (const file of this.fileUpload._files) {
        this.uploadService.uploadPhoto(file).subscribe( next => {
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
    if (this.inputProduct.name === undefined || this.inputProduct.name.length < 3) {
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

    if ( this.inputProduct.price === undefined || this.inputProduct.price <= 0) {
      this.toastService.error('Cena powinna być liczbą dodatnią');
      return false;
    }

    if (this.selectedUnit === undefined) {
      this.toastService.error('Nie wybrano jednostki');
      return false;
    }

    if (this.inputProduct.itemsNumber === undefined || this.inputProduct.itemsNumber <= 0) {
      this.toastService.error('Dostępna ilość powinna być liczbą dodatnią');
      return false;
    }

    if (this.selectedUnit.isInteger && !Number.isInteger(this.inputProduct.itemsNumber)) {
      this.toastService.error('Dla wybranej jednostki ilość powinna być liczbą całkowitą');
      return false;
    }

    if (!this.fileUpload._files.length) {
      this.toastService.error('Produkt powinno reprezentować conajmniej jedno zdjęcie');
      return false;
    }
    return true;
  }

  orderChanged() {
    this.displayImagesOrder = false;
    this.goBackToManagement();
  }

  private goBackToManagement() {
    this.router.navigate(['management']);
  }
}
