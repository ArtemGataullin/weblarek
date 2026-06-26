import './scss/styles.scss';

import { ServerApi } from './components/serverApi/serverApi';
import { EventEmitter } from './components/base/Events';

import { ShoppingCart } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';



import { Basket } from './components/views/Basket';
import { CardBasket, CardPreview, CardCatalog } from './components/views/Card';
import { OrderForm, ContactsForm } from './components/views/Form';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { Success } from './components/views/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const ItemsModel = new ProductCatalog(events);
const BasketModel  = new ShoppingCart(events);
const BuyerModel = new Buyer(events);
const api = new ServerApi(CDN_URL, API_URL);

const GalleryTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const PreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const BasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const page = new Gallery(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);

// Функции валидации
function validateOrderForm() {
    const errors = BuyerModel.validate();
    const isValid = !errors.address && !errors.payment;
    
    orderForm.render({
        valid: isValid,
        errors: Object.values(errors).filter(error => error !== undefined)
    });
}

function validateContactsForm() {
    const errors = BuyerModel.validate();
    const isValid = !errors.email && !errors.phone;
    
    contactForm.render({
        valid: isValid,
        errors: Object.values(errors).filter(error => error !== undefined)
    });
}

// Получение данных о товарах с сервера
api.getItemList()
    .then(data => {
        ItemsModel.saveProducts(data);
    })
    .catch(err => {
        console.error(err);
    });

// Отображение галереи товаров
events.on('items:changed', () => {
    const itemsHTMLArray = ItemsModel.getProducts().map(item =>
        new CardCatalog(cloneTemplate(GalleryTemplate), events).render(item)
    )
    page.catalog = itemsHTMLArray;
    
    header.render({
        counter: BasketModel.getSelectedProductsAmount()
    })
});

// Изменение корзины
events.on('basket:changed', () => {
    header.render({
        counter: BasketModel.getSelectedProductsAmount()
    })
    const itemsHTMLArray = BasketModel.getSelectedProducts().map((item, index) => {
        const cardNumber = index + 1;
        return new CardBasket(cloneTemplate(BasketTemplate), events).render(Object.assign({...item, cardNumber}))
    });
    basket.render({
        list: itemsHTMLArray,
        price: BasketModel.getTotalPrice()
    });
});

// Добавление и удаление товара из корзины
events.on('selectedItem:basketAction', ({id}: {id: string})=> {
    if (!BasketModel.checkSelectedProduct(id)) {
        const product  = ItemsModel.getProductByID(id);
        if (product) {
            BasketModel.addSelectedProduct(product)
        } else {
            console.warn(`Товар с id ${id} не найден`);
        }
    } else {
        BasketModel.deleteSelectedProduct(id)
    }
})

//  Выбор карточки для отображения в модальном окне

events.on('card:open', ({id}: {id: string}) => {
    const selectedProduct = ItemsModel.getProductByID(id);
    if (selectedProduct) { 
        ItemsModel.setSelectedProduct(selectedProduct) 
    } else {
        console.warn(`Товар с id ${id} не найден`);
    }
})

// Карточка для отображения в модальном окне добавлена в модель

events.on('card:selected', () => {
    const selectedProduct = ItemsModel.getSelectedProduct();

    if (!selectedProduct) {
        console.warn('Товар не выбран');
        return;
    }

    const isInBasket = BasketModel.checkSelectedProduct(selectedProduct.id);

    const itemHTML = new CardPreview(cloneTemplate(PreviewTemplate), events).render({
        ...selectedProduct,
        buttonText: isInBasket ? 'Удалить из корзины' : 'Купить'
    });

    modal.render({
        content: itemHTML
    })
})

//  Открытие модального окна с корзиной

events.on('basket:open', () => {
    const itemsHTMLArray = BasketModel.getSelectedProducts().map((item, index) => {
        const cardNumber = index + 1;
        return new CardBasket(cloneTemplate(BasketTemplate), events).render({
            ...item,
            cardNumber
        });
    });
    
    basket.render({
        list: itemsHTMLArray,
        price: BasketModel.getTotalPrice()
    });
    
    modal.render({
        content: basket.element
    });
});

//  Открытие модального окна с формой заказа

events.on('basket:submit', () => {
    BuyerModel.clearBuyerData();
    orderForm.render({
        address: '',
        valid: false,
        errors: []
    });
    modal.render({
        content: orderForm.element 
    });
});

// Изменилось одно из полей формы order

events.on('order.address:changed', ({ value }: { value: string }) => {
    BuyerModel.saveAddress(value);
    validateOrderForm();
});

// Изменился способ оплаты

events.on('order.payment:changed', ({ value }: { value: string }) => {
    BuyerModel.savePaymentType(value as 'card' | 'cash');
    orderForm.changeButtonState(
        value === 'card',
        value === 'cash'
    );
    validateOrderForm();
});

// Подтверждение формы заказа

events.on('order:submit', () => {
    const errors = BuyerModel.validate();
    const isValid = !errors.address && !errors.payment;

    if (isValid) {
        contactForm.render({
            valid: false,
            errors: []
        });
        modal.render({
            content: contactForm.element
        })
    }
})

// Изменилось одно из полей формы contacts

events.on('contacts.email:changed', ({value}: { value: string }) => {
    BuyerModel.saveEmail(value);
    validateContactsForm()
})

events.on('contacts.phone:changed', ({value}: { value: string }) => {
    BuyerModel.savePhone(value);
    validateContactsForm()
})

// Подтверждение оплаты

events.on('contacts:submit', () => {
    const errors = BuyerModel.validate();
    const isValid = !errors.email && !errors.phone; 

    if (isValid) {
        const buyerData = BuyerModel.getData();
        const orderRequest = {
            ...buyerData,
            total: BasketModel.getTotalPrice(),
            items: BasketModel.getSelectedProducts().map(item => item.id)
        };

        api.placeOrder(orderRequest)
            .then(result => {
                BasketModel.clearShoppingCart();
                const success = new Success(cloneTemplate(successTemplate), {
                    onClick: () => {
                        modal.close();
                        orderForm.render({
                            address: '',
                            valid: false,
                            errors: []
                        });
                        contactForm.render({
                            valid: false,
                            errors: []
                        });
                    },
                });

                const successElement = success.render({
                    total: result.total
                });
                modal.render({
                    content: successElement
                });
            })
            .catch(err => {
                console.error('Ошибка при оформлении заказа:', err);
            });
    }
})

// Блокировка и разблокирвока прокрутки страницы при открытии модального окна

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
    modal.content = document.createElement('div');
});