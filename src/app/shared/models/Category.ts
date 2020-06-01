export class Category {
  id?: string;
  parentId?: string;
  name: string;

  constructor(id: string, parentId: string, name: string) {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
  }
}
