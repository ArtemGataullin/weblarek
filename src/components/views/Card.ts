import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface ICard extends IProduct{
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

type CategoryKey = keyof typeof categories

export class Card extends Component<Partial<ICard>> {
  protected titleCard: HTMLElement;
  protected priceCard: HTMLElement;
  protected CardId!: string

  constructor (protected container: HTMLElement, protected events: EventEmitter) {
    super(container)

    this.titleCard = ensureElement('.card__title', this.container);
    this.priceCard = ensureElement('.card__price', this.container);
  }

  set title(value: string) {
    this.setText(this.titleCard, value)
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this.priceCard, 'Бесценно')
    } else {
      this.setText(this.priceCard, `${value} синапсов`)
    }
  }

  set id(value: string) {
    this.CardId = value;
  }
}

export class CardCatalog extends Card {
  protected categoryCard: HTMLElement
  protected imageCard: HTMLImageElement

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container, events);

    this.imageCard = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.categoryCard = ensureElement('.card__category', this.container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:open', {id: this.CardId})
    })
  }

  set image(value: string) {
    this.setImage(this.imageCard, value, this.title)
  }

  set category(value: string) {
    this.setText(this.categoryCard, value);
    for (const key in categories) {
      this.categoryCard.classList.toggle(categories[key as CategoryKey], key === value)
    }
  }
}

export class CardPreview extends CardCatalog {
  protected descriptionCard: HTMLElement
  protected buttonCard: HTMLButtonElement

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container, events);

    this.descriptionCard = ensureElement('.card__text', this.container);
    this.buttonCard = ensureElement('.card__button', this.container) as HTMLButtonElement

    this.buttonCard.addEventListener('click', () => {
      this.events.emit('selectedItem:basketAction', {id: this.CardId})
    })
  }

  set description(value: string) {
    this.setText(this.descriptionCard, value)
  }

  set buttonText(value: string) {
    this.setText(this.buttonCard, value);
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.setDisabled(this.buttonCard, true);
      this.setText(this.buttonCard,'Недоступно')
    } else {
      this.setDisabled(this.buttonCard,false)
    }
  }
}


export class CardBasket extends Card {
  protected buttonCard: HTMLButtonElement
  protected indexCard: HTMLElement

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container, events);

    this.indexCard = ensureElement('.basket__item-index', this.container);
    this.buttonCard = ensureElement('.card__button', this.container) as HTMLButtonElement

    this.buttonCard.addEventListener('click', () => {
      this.events.emit('selectedItem:basketAction', {id: this.CardId})
    })
  }

  set cardNumber (value: number) {
    this.setText(this.indexCard, String(value))
  }
}