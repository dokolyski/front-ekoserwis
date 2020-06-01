import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../shared/services/categories.service';
import {MenuItem} from 'primeng/api';
import {Category} from '../shared/models/Category';
import {TreeNode} from 'primeng';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private categoriesService: CategoriesService) { }

  productsItem: MenuItem = {
    label: 'Produkty',
    routerLink: ['/products'],
    items: []
  };

  items: MenuItem[];

  ngOnInit() {
    const categories: Promise<Category[]> = this.categoriesService.getCategories();

    categories.then(data => {
      this.createCategoriesTree(data);
    });

    this.items = [
      this.productsItem,
      {label: 'Moje zakupy', routerLink: ['myShopping']},
      {label: 'Kontakt', routerLink: ['contact']},
      {label: 'Zarządzaj asortymentem', routerLink: ['management']}
    ];
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

  private hasCategory(elements: MenuItem[], parentID: string): MenuItem {
    for (const item of elements) {
      if (item.id === parentID) {
        return (item as MenuItem);
      } else {
        if (item.items !== undefined) {
          const returnedElement: MenuItem = this.hasCategory(item.items as MenuItem[], parentID);
          if (returnedElement !== undefined) {
            return returnedElement;
          }
        }
      }
    }
  }

  private addCategory(cat: Category): boolean {
    let newItem: MenuItem;
    if (cat.parentId === null) {
      newItem = {label: cat.name, id: cat.id, routerLink: [this.productsItem.routerLink + '/' + cat.id]};
      (this.productsItem.items as MenuItem[]).push(newItem);
      return true;
    }
    const parentItem: MenuItem = this.hasCategory(this.productsItem.items as MenuItem[], cat.parentId);
    if (parentItem !== undefined) {
      newItem = {label: cat.name, id: cat.id, routerLink: [this.productsItem.routerLink + '/' + cat.id]};
      if (parentItem.items === undefined) {
        parentItem.items = [newItem];
      } else {
        (parentItem.items as MenuItem[]).push(newItem);
      }
      return true;
    }
    return  false;
  }
}
