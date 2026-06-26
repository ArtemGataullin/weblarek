import { IProduct } from '../../types/index';
import { IEvents } from "../base/Events";

export class ProductCatalog {
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.products = [];
    this.selectedProduct = null
  }

  saveProducts(products: IProduct[]){
    this.products = products;
    this.events.emit('items:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  setSelectedProduct(product: IProduct | null){
    this.selectedProduct = product;
    this.events.emit('card:selected');
  }
  
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  getProductByID(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
}