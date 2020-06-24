import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng';

@Component({
  selector: 'app-management-pane',
  templateUrl: './management-pane.component.html',
  styleUrls: ['./management-pane.component.scss']
})
export class ManagementPaneComponent implements OnInit {
  items: MenuItem[] = [
    {label: 'Edytuj zawartość magazynu', routerLink: ['storedProducts']},
    {label: 'Dodaj produkt', routerLink: ['upload']},
    {label: 'Edytuj produkty', routerLink: ['edit']},
    {label: 'Zarządzaj kategoriami', routerLink: ['categories']},
  ];

  constructor() { }

  ngOnInit() {
  }

}
