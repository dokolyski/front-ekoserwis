import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-image-order',
  templateUrl: './image-order.component.html',
  styleUrls: ['./image-order.component.scss']
})
export class ImageOrderComponent implements OnInit {
  @Input() readonly productID: string;
  photos: any[] = [];

  constructor() { }

  ngOnInit() {
  }
}
