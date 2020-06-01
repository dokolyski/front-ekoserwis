export class Product {
  id?: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  itemsNumber: number;
  dimensions?: string;
  weight?: string;
  category: string;


  // tslint:disable-next-line:max-line-length
  constructor(name: string, price: number, description: string, images: string[], itemsNumber: number, dimensions: string, weight: string, category: string) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.images = images;
    this.itemsNumber = itemsNumber;
    this.dimensions = dimensions;
    this.weight = weight;
    this.category = category;
  }
}
