import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ShoppingCart } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';


// Каталог товаров
console.log('--------------------------Каталог товаров--------------------------------');
const productsCatalogModel = new ProductCatalog();

productsCatalogModel.saveProduct(apiProducts.items);
console.log("Массив товаров из каталога: ", productsCatalogModel.getProduct());

productsCatalogModel.saveProducts(apiProducts.items)
console.log("Товар найденный по id из каталога: ", productsCatalogModel.getProductByID('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
console.log("Товар выбранный для отображения: ", productsCatalogModel.getProduct()[0]);

// Корзина
console.log('------------------------------Корзина-----------------------------------');

const shoppingCartModel = new ShoppingCart();

shoppingCartModel.addSelectedProduct(apiProducts.items[1])
shoppingCartModel.addSelectedProduct(apiProducts.items[2])

console.log("Список всех товаров добавленных в корзину: ", shoppingCartModel.getSelectedProducts());
shoppingCartModel.deleteSelectedProduct('b06cde61-912f-4663-9751-09956c0eed67')
console.log("Список всех товаров добавленных в корзину, после удаленния одного: ", shoppingCartModel.getSelectedProducts());
shoppingCartModel.clearShoppingCart()
console.log("Список всех товаров добавленных в корзину, после очиски корзины: ", shoppingCartModel.getSelectedProducts());


shoppingCartModel.addSelectedProduct(apiProducts.items[1])
shoppingCartModel.addSelectedProduct(apiProducts.items[2])
console.log('Общая стоимость товаров в корзине: ', shoppingCartModel.getTotal());
console.log('Число товар в корзине: ', shoppingCartModel.getSelectedProductsAmount());
console.log('Yаличие товара с указанным id в корзине: ', shoppingCartModel.checkSelectedProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));


// Покупатель

console.log('----------------------------Покупатель----------------------------------');
const buyerModel = new Buyer();

buyerModel.saveAddress('Chelibinsk');
buyerModel.saveEmail('artyom.gataullin@gmail.ru');
buyerModel.savePhone('89954699691');
buyerModel.savePaymentType('cash');

console.log('Полный объект покупателя: ', buyerModel.getData());
buyerModel.clearBuyerData()
console.log('Сброс всех полей объекта покупателя: ', buyerModel.getData());
console.log('Валидность полей ввода объекта покупатель: ', buyerModel.validate());



