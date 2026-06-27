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

  set list(items: HTMLElement[]) {
    this.listBasket.replaceChildren(...items);

    this.setDisabled(this.buttonBasket, items.length === 0);
  }

  set price(value: number) {
      this.setText(this.priceBasket, `${value} синапсов`)
  }
}