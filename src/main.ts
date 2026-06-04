import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ShoppingCart } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ServerApi } from './components/serverApi/serverApi';
import { IProductListApi } from './types';


// Каталог товаров
console.log('--------------------------Каталог товаров--------------------------------');
const productsCatalogModel = new ProductCatalog();

productsCatalogModel.saveProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productsCatalogModel.getProducts());

productsCatalogModel.saveProduct(apiProducts.items[1])
console.log("Товар найденный по id из каталога: ", productsCatalogModel.getProductByID('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
productsCatalogModel.saveProduct(apiProducts.items[0])
console.log("Товар выбранный для отображения: ", productsCatalogModel.getProducts()[0]);

// Корзина
console.log('------------------------------Корзина-----------------------------------');

const shoppingCartModel = new ShoppingCart();

shoppingCartModel.addSelectedProduct(apiProducts.items[0]);
shoppingCartModel.addSelectedProduct(apiProducts.items[1]);
shoppingCartModel.addSelectedProduct(apiProducts.items[2]);

console.log('Список всех товаров добавленных в корзину: ', shoppingCartModel.getSelectedProducts());
console.log('Наличие товара с указанным id в корзине: ', shoppingCartModel.checkSelectedProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

shoppingCartModel.deleteSelectedProduct('b06cde61-912f-4663-9751-09956c0eed67');

console.log('Наличие найти товар в корзине после его удаления: ', shoppingCartModel.checkSelectedProduct('b06cde61-912f-4663-9751-09956c0eed67'));
console.log("Список всех товаров добавленных в корзину, после удаленния одного: ", shoppingCartModel.getSelectedProducts());
console.log('Число товар в корзине: ', shoppingCartModel.getSelectedProductsAmount());
console.log('Общая стоимость товаров в корзине: ', shoppingCartModel.getTotal());

shoppingCartModel.clearShoppingCart()
console.log("Список всех товаров добавленных в корзину, после очиски корзины: ", shoppingCartModel.getSelectedProducts());




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


console.log('----------------------------API----------------------------------');
const apiModel = new Api(API_URL);
const serverApiModel = new ServerApi(apiModel);
serverApiModel.getProducts()
    .then((result: IProductListApi) => {
        productsCatalogModel.saveProducts(result.items);
        // Просмотр productsCatalogModel класс
        console.log('Массив товаров от сервера: ', productsCatalogModel.getProducts());
        console.log('Товар найденный по id из массива: ', productsCatalogModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c390"));
        console.log('Товар не найденный по id из массива: ', productsCatalogModel.getProductByID("854cef69-976d-4c2a-a18c-2aa45046c391"));
        productsCatalogModel.saveProduct(result.items[0]);
        console.log('Товар выбранный для отображения: ', productsCatalogModel.getProduct());

        // Просмотр shoppingCartModel класс
        shoppingCartModel.addSelectedProduct(result.items[0]);
        shoppingCartModel.addSelectedProduct(result.items[1]);
        console.log('Список всех товаров добавленных в корзину: ', shoppingCartModel.getSelectedProducts());
        console.log('Наличие товара с указанным id в корзине: ', shoppingCartModel.checkSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
        shoppingCartModel.deleteSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
        console.log('Наличие найти товар в корзине после его удаления: ', shoppingCartModel.checkSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
        console.log('Список всех товаров добавленных в корзину, после удаленния одного: ', shoppingCartModel.getSelectedProducts());
        console.log('Число товар в корзине: ', shoppingCartModel.getSelectedProductsAmount());
        console.log('Общая стоимость товаров в корзине: ', shoppingCartModel.getTotal());
        shoppingCartModel.clearShoppingCart();
        console.log('Список всех товаров добавленных в корзину, после очиски корзины: ', shoppingCartModel.getSelectedProducts());
    })
    .catch(error => {
        console.error('Error', error);
    });