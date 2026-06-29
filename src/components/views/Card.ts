import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICard extends IProduct {
    title: string;
    price: number | null;
    buttonText?: string;
    cardNumber?: number;
}

const categories = {
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard'
};

type CategoryKey = keyof typeof categories;

export class Card extends Component<Partial<ICard>> {
    protected titleCard: HTMLElement;
    protected priceCard: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);

        this.titleCard = ensureElement('.card__title', this.container);
        this.priceCard = ensureElement('.card__price', this.container);
    }

    set title(value: string) {
        this.setText(this.titleCard, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this.priceCard, 'Бесценно');
        } else {
            this.setText(this.priceCard, `${value} синапсов`);
        }
    }
}

// CardWithImage - для карточек с изображением и категорией
export class CardWithImage extends Card {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.imageCard = this.container.querySelector('.card__image') as HTMLImageElement;
        this.categoryCard = this.container.querySelector('.card__category') as HTMLElement;
    }

    set image(value: string) {
        if (this.imageCard) {
            this.setImage(this.imageCard, value, this.title);
        }
    }

    set category(value: string) {
        if (this.categoryCard) {
            this.setText(this.categoryCard, value);
            for (const key in categories) {
                this.categoryCard.classList.toggle(categories[key as CategoryKey], key === value);
            }
        }
    }
}

export class CardCatalog extends CardWithImage {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        // Просто вызываем колбэк при клике
        this.container.addEventListener('click', () => {
            onClick();
        });
    }
}

export class CardPreview extends CardWithImage  {
    protected descriptionCard: HTMLElement;
    protected buttonCard: HTMLButtonElement;
    protected onButtonClick: () => void;

    constructor(container: HTMLElement, onButtonClick: () => void) {
        super(container);

        this.descriptionCard = ensureElement('.card__text', this.container);
        this.buttonCard = ensureElement('.card__button', this.container) as HTMLButtonElement;
        this.onButtonClick = onButtonClick;

        this.buttonCard.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onButtonClick();
        });
    }

    set description(value: string) {
        this.setText(this.descriptionCard, value);
    }

    set buttonText(value: string) {
        this.setText(this.buttonCard, value);
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.setDisabled(this.buttonCard, true);
            this.setText(this.buttonCard, 'Недоступно');
        } else {
            this.setDisabled(this.buttonCard, false);
        }
    }
}

export class CardBasket extends Card {
    protected buttonCard: HTMLButtonElement;
    protected indexCard: HTMLElement;
    protected onDeleteClick: () => void;

    constructor(container: HTMLElement, onDeleteClick: () => void) {
        super(container);

        this.indexCard = ensureElement('.basket__item-index', this.container);
        this.buttonCard = ensureElement('.card__button', this.container) as HTMLButtonElement;
        this.onDeleteClick = onDeleteClick;

        this.buttonCard.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onDeleteClick();
        });
    }

    set cardNumber(value: number) {
        this.setText(this.indexCard, String(value));
    }
}