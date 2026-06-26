import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IBasket {
  list: HTMLElement[],
  price: number
}
export class Basket extends Component<IBasket> {
  protected listBasket: HTMLElement;
  protected priceBasket: HTMLElement;
  protected buttonBasket: HTMLButtonElement

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container)

    this.listBasket = ensureElement('.basket__list', this.container)
    this.priceBasket = ensureElement('.basket__price', this.container)
    this.buttonBasket = ensureElement('.basket__button', this.container) as HTMLButtonElement

    this.buttonBasket.addEventListener('click', () => {
      this.events.emit('basket:submit')
    })
  }

  get element(): HTMLElement {
    return this.container;
  }

  set list(items: HTMLElement[]) {
    if (items.length) {
      this.listBasket.replaceChildren(...items);
      this.setDisabled(this.buttonBasket, false);
    } else {
      this.listBasket.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
      this.setDisabled(this.buttonBasket, true);
    }
  }

  set price(value: number) {
      this.setText(this.priceBasket, `${value} синапсов`)
  }
}