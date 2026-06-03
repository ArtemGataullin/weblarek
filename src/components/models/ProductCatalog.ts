import { TProduct } from '../../types/index';

export class ProductCatalog {
  protected products: TProduct[];
  protected selectedProduct: TProduct | null;

  constructor() {
    this.products = [];
    this.selectedProduct = null
  }

  saveProducts(products: TProduct[]){
    this.products = products;
  }

  getProducts(): TProduct[] {
    return this.products;
  }

  getProductByID(id: string): TProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  saveProduct(product: TProduct | null){
    this.selectedProduct = product;
  }

  getProduct(): TProduct | null {
    return this.selectedProduct;
  }
}