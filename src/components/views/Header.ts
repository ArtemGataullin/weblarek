import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents,) {
    super(container);

    this.counterElement = ensureElement('.header__basket-counter', this.container);
    this.basketButton = ensureElement('.header__basket', this.container) as HTMLButtonElement;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.setText(this.counterElement, value);
  }
}