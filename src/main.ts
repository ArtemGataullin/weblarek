import './scss/styles.scss';

import { ServerApi } from './components/serverApi/serverApi';
import { Api } from './components/base/Api';
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
const itemsModel = new ProductCatalog(events);
const basketModel  = new ShoppingCart(events);
const buyerModel = new Buyer(events);

const apiInstance = new Api(API_URL);
const serverApi = new ServerApi(apiInstance);

const galleryTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
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

// Создаем экземпляр CardPreview один раз
const cardPreview = new CardPreview(
    cloneTemplate(previewTemplate) as HTMLElement,
    () => {
        // ✅ В обработчике получаем ID из модели
        const selectedProduct = itemsModel.getSelectedProduct();
        if (selectedProduct) {
            events.emit('preview:addToBasket', { id: selectedProduct.id });
        }
    }
);

const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        events.emit('success:close');
    },
});

// Получение данных о товарах с сервера
serverApi.getProducts()
    .then(data => {
        const products = data.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        itemsModel.saveProducts(products);
    })
    .catch(err => {
        console.error(err);
    });

// Отображение галереи товаров
events.on('items:changed', () => {
    const itemsHTMLArray = itemsModel.getProducts().map(item => {
        const template = cloneTemplate(galleryTemplate) as HTMLElement;
        const card = new CardCatalog(
            template,
            () => {
                events.emit('card:open', { id: item.id });
            }
        );

        const element = card.render(item);
        return element;
    });
    page.catalog = itemsHTMLArray;
    
    header.render({
        counter: basketModel.getSelectedProductsAmount()
    })
});

// Изменение корзины
events.on('basket:changed', () => {
    header.render({
        counter: basketModel.getSelectedProductsAmount()
    })

    const itemsHTMLArray = basketModel.getSelectedProducts().map((item, index) => {
        const cardNumber = index + 1;

        const template = cloneTemplate(cardBasketTemplate) as HTMLElement;
        const card = new CardBasket(
            template,
            () => {
                events.emit('basket:removeItem', { id: item.id });
            }
        );

        const element = card.render({
            ...item,
            cardNumber
        });
        return element;
    });

    basket.render({
        list: itemsHTMLArray,
        price: basketModel.getTotalPrice()
    });
});

// Обработчик добавления/удаления из превью
events.on('preview:addToBasket', ({ id }: { id: string }) => {
    if (!basketModel.checkSelectedProduct(id)) {
        const product = itemsModel.getProductByID(id);
        if (product) {
            basketModel.addSelectedProduct(product);
            modal.close();
        } else {
            console.warn(`Товар с id ${id} не найден`);
        }
    } else {
        basketModel.deleteSelectedProduct(id);
        modal.close();
    }
});

// Обработчик удаления из корзины
events.on('basket:removeItem', ({ id }: { id: string }) => {
    basketModel.deleteSelectedProduct(id);
});

//  Выбор карточки для отображения в модальном окне

events.on('card:open', ({id}: {id: string}) => {
    const selectedProduct = itemsModel.getProductByID(id);
    if (selectedProduct) { 
        itemsModel.setSelectedProduct(selectedProduct) 
    } else {
        console.warn(`Товар с id ${id} не найден`);
    }
})

// Карточка для отображения в модальном окне
events.on('card:selected', () => {
    const selectedProduct = itemsModel.getSelectedProduct();

    if (!selectedProduct) {
        console.warn('Товар не выбран');
        return;
    }

    const isInBasket = basketModel.checkSelectedProduct(selectedProduct.id);

    const itemHTML = cardPreview.render({
        ...selectedProduct,
        buttonText: isInBasket ? 'Удалить из корзины' : 'Купить'
    });

    modal.render({
        content: itemHTML
    });
});

//  Открытие модального окна с корзиной

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

//  Открытие модального окна с формой заказа

events.on('basket:submit', () => {
    modal.render({
        content: orderForm.render()
    });
});

// Изменилось одно из полей формы order

events.on('order.address:changed', ({ value }: { value: string }) => {
    buyerModel.saveAddress(value);
});

// Изменился способ оплаты

events.on('order.payment:changed', ({ value }: { value: string }) => {
    buyerModel.savePaymentType(value as 'card' | 'cash');
});

// Подтверждение формы заказа

events.on('order:submit', () => {
    modal.render({
        content: contactForm.render()
    })
})

// Изменилось одно из полей формы contacts

events.on('contacts.email:changed', ({value}: { value: string }) => {
    buyerModel.saveEmail(value);
})

events.on('contacts.phone:changed', ({value}: { value: string }) => {
    buyerModel.savePhone(value);
})

// Единый обработчик изменения данных покупателя

events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    
    // Обновляем форму заказа
    const isOrderValid = !errors.address && !errors.payment;
    orderForm.render({
        address: buyerData.address,
        valid: isOrderValid,
        errors: Object.values(errors).filter(error => error !== undefined)
    });
    
    // Обновляем состояние кнопок оплаты
    orderForm.changeButtonState(
        buyerData.payment === 'card',
        buyerData.payment === 'cash'
    );
    
    // Обновляем форму контактов
    const isContactsValid = !errors.email && !errors.phone;
    contactForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: isContactsValid,
        errors: Object.values(errors).filter(error => error !== undefined)
    });
});

// Подтверждение оплаты

events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderRequest = {
        ...buyerData,
        total: basketModel.getTotalPrice(),
        items: basketModel.getSelectedProducts().map(item => item.id)
    };

    serverApi.postOrder(orderRequest)
        .then(result => {
            // Очищаем корзину
            basketModel.clearShoppingCart();
            
            // Очищаем данные покупателя после успешного заказа
            buyerModel.clearBuyerData();
            
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
})

// Блокировка и разблокирвока прокрутки страницы при открытии модального окна

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
    modal.content = document.createElement('div');
});

events.on('success:close', () => {
    modal.close();
});