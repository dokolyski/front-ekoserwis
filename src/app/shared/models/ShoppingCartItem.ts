import {Unit} from './Unit';

export class ShoppingCartItem {
  id: string;
  photoId: string;
  name: string;
  amount: number;
  photo?: any;
  price?: number;
  unitPrice?: number;
  unit?: Unit;
}
