import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng';

@Component({
  selector: 'app-management-pane',
  templateUrl: './management-pane.component.html',
  styleUrls: ['./management-pane.component.scss']
})
export class ManagementPaneComponent implements OnInit {
  items: MenuItem[] = [
    {label: 'Dodaj produkt', routerLink: ['upload']},
    {label: 'Zarządzaj kategoriami', routerLink: ['categories']},
    {label: 'Edytuj zawartość magazynu', routerLink: ['storedProducts']}
  ];

  constructor() { }

  ngOnInit() {
  }

}
