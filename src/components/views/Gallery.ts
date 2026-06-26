import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IGallery {
  catalog: HTMLElement[],
  locked: boolean
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.catalogElement = ensureElement('.gallery', this.container)
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items)
  }

  set locked(value: boolean) {
    if(value) {
      this.container.classList.add('page__wrapper_locked')
    } else {
      this.container.classList.remove('page__wrapper_locked');
    }
  }
}