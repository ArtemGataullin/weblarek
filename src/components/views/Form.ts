import { IForm, IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";


export class Form<T> extends Component<IForm> {
  protected buttonForm: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
    super(container)

    this.buttonForm = ensureElement('.button', this.container) as HTMLButtonElement
    this.errorElement = ensureElement('.form__errors', this.container) as HTMLSpanElement

    this.container.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value)
    })

    this.buttonForm.addEventListener('click', (evt: Event) => {
      evt.preventDefault();
      this.events.emit(`${this.container.name}:submit`)
    })
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:changed`,{
      field,
      value
    })
  }

  set valid(value: boolean) {
    this.buttonForm.disabled = !value
  }

  set errors(value: string[]) {
    this.setText(this.errorElement, value.filter(i => !!i).join(';'))
  }

  get element(): HTMLFormElement {
    return this.container;
  }

  render(state: Partial<T> & Partial<IForm>) {
    const {valid, errors, ...inputs} = state;
    super.render({valid, errors});
    Object.assign(this, inputs);
    return this.container
  }
}

export class OrderForm extends Form<Partial<IBuyer>> {
  protected cardButtonForm: HTMLButtonElement;
  protected cashButtonForm: HTMLButtonElement;
  protected adressInputForm: HTMLInputElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
      super(container, events);
      this.cardButtonForm = ensureElement('button[name="card"]', this.container) as HTMLButtonElement;
      this.cashButtonForm = ensureElement('button[name="cash"]', this.container) as HTMLButtonElement;
      this.adressInputForm = ensureElement('.form__input', this.container) as HTMLInputElement;

      this.cardButtonForm.addEventListener('click', (evt: Event) => {
          const target = evt.target as HTMLButtonElement;
          this.onInputChange('payment' as keyof IBuyer, target.name);
      });

      this.cashButtonForm.addEventListener('click', (evt: Event) => {
          const target = evt.target as HTMLButtonElement;
          this.onInputChange('payment' as keyof IBuyer, target.name);
      });

  }

  changeButtonState(isCard: boolean, isCash: boolean) {
      this.toggleClass(this.cardButtonForm, 'button_alt-active', isCard);
      this.toggleClass(this.cashButtonForm, 'button_alt-active', isCash);
  }

  set address(value: string) {
      this.adressInputForm.value = value;
  }
}

export class ContactsForm extends Form<Partial<IBuyer>> {
  protected emailInputForm: HTMLInputElement;
  protected phoneInputForm: HTMLInputElement;

  constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
      super(container, events);
      this.emailInputForm = ensureElement('input[name="email"]', this.container) as HTMLInputElement;
      this.phoneInputForm = ensureElement('input[name="phone"]', this.container) as HTMLInputElement;
  }

  set email(value: string) {
      this.emailInputForm.value = value;
  }

  set phone(value: string) {
      this.phoneInputForm.value = value;
  }
}
