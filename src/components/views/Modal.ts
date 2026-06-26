import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IModal {
  content: HTMLElement
}

export class Modal extends Component<IModal> {
  protected clouseButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.clouseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container) as HTMLButtonElement;
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

    this.clouseButton.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (event) => {
        if (event.target === this.container) {
          this.close();
        }
      });

    this.modalContent.addEventListener('click',(event) => event.stopPropagation())

  }

  set content(item: HTMLElement) {
    this.modalContent.replaceChildren(item)
  }

  open() {
    this.container.classList.add('modal_active')
    this.events.emit('modal:open')
  }

  close() {
    this.container.classList.remove('modal_active')
    this.events.emit('modal:close')
  }

  render(data?: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container
  }
}