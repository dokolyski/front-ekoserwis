import {Category} from '../models/Category';
import {TreeNode} from 'primeng';
import {MenuItem} from 'primeng/api';
import {ToastService} from './toast.service';
import {CategoriesService} from './categories.service';

// not injectable!!!
export class CategoriesTreeService {
  private categoriesTree: TreeNode[];

  constructor(private toastService: ToastService,
              private categoriesService: CategoriesService) {
  }

  getDataAndFormat(): Promise<TreeNode[]> {
    this.categoriesTree = [];
    return new Promise<TreeNode[]>(resolve => {
      this.categoriesService.getCategories().then(data => this.createCategoriesTree(data))
        .catch(() => this.toastService.error('Nie udało się załadować kategorii'))
        .finally(() => {
          this.categoriesTree.push({styleClass: 'inputNode', children: []});
          this.insertInputChildren();
          resolve(this.categoriesTree);
        });
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

  removeInputNodes(event) {
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
}
