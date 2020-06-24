import { Component, OnInit } from '@angular/core';
import {ToastService} from '../../shared/services/toast.service';
import {UploadProductService} from '../../shared/services/upload-product.service';
import {CategoriesService} from '../../shared/services/categories.service';
import {TreeNode} from 'primeng';
import {CategoriesTreeService} from '../../shared/services/categories-tree.service';

@Component({
  selector: 'app-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.scss']
})
export class CategoriesManagementComponent implements OnInit {
  categoriesTree: TreeNode[] = [];
  categoriesTreeService: CategoriesTreeService;

  constructor(private toastService: ToastService,
              private uploadService: UploadProductService,
              private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesTreeService = new CategoriesTreeService(this.toastService, this.categoriesService);
    this.categoriesTreeService.getDataAndFormat().then(value => this.categoriesTree = value);
  }

  removeCategory(node: TreeNode) {
    this.categoriesService.remove(node.key).then(() => {
      this.toastService.success('Usunięto kategorię');
      if (node.parent) {
        node.parent.children.splice(node.parent.children.findIndex(value => value.key === node.key), 1);
      } else {
        this.categoriesTree.splice(this.categoriesTree.findIndex(value => value.key === node.key), 1);
      }
    }).catch(reason => this.toastService.error(reason.error.message));
  }

  addCategory(node: TreeNode) {
    if (node.label) {
      let promise: Promise<string>;
      if (node.parent) {
        promise = this.categoriesService.addNewCategory(node.label, node.parent.key);
      } else {
        promise = this.categoriesService.addNewCategory(node.label);
      }
      promise.then(key => {
        node.key = key;
        this.categoriesTreeService.getDataAndFormat().then(value => this.categoriesTree = value);
        this.toastService.success('Dodano kategorię');
      }).catch(reason => this.toastService.error(JSON.parse(reason.error).message));
    }
  }

  editCategory(node) {
    if (node.label) {
      this.categoriesService.rename(node.label, node.key).then(key => {
        this.categoriesTreeService.getDataAndFormat().then(value => this.categoriesTree = value);
        this.toastService.success('Zmieniono nazwę kategorii');
      }).catch(reason => {
        this.toastService.error(reason.error.message);
        this.categoriesTreeService.getDataAndFormat().then(value => this.categoriesTree = value);
      });
    }
  }
}
