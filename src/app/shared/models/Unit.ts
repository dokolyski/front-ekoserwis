export class Unit {
  id?: string;
  name: string;
  isInteger: boolean;

  constructor(name: string, isInteger: boolean) {
    this.name = name;
    this.isInteger = isInteger;
  }
}
