export class Order {
  id?: string;
  userId?: string;
  positions?: {
    productName: string;
    amount: number;
  }[];
  orderDate: string;
  amount: number;
  status: string;
  customerData?: {
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
  };
}
