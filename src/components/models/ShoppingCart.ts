import { TProduct } from '../../types/index';

export class ShoppingCart {
  protected selectedProducts: TProduct[];

  constructor() {
    this.selectedProducts = [];
  }

  getSelectedProducts(): TProduct[] {
    return this.selectedProducts;
  }

  addSelectedProduct(product: TProduct) {
    this.selectedProducts.push(product);
  }

  deleteSelectedProduct(id: string) {
    this.selectedProducts = this.selectedProducts.filter(selectedProduct => selectedProduct.id !== id);
  }

  clearShoppingCart() {
    this.selectedProducts = [];
  }

  getTotal(): number {
    return this.selectedProducts.reduce((total, selectedProduct) => total + (selectedProduct.price || 0), 0);
  }

  getSelectedProductsAmount(): number {
    return this.selectedProducts.length;
  }

  checkSelectedProduct(id: string): boolean {
    return this.selectedProducts.some(selectedProduct => selectedProduct.id === id);
  }
}