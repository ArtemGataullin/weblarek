import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
  total: number
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected clouseButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(protected container: HTMLElement, protected actions: ISuccessActions) {
    super(container);

    this.clouseButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container) as HTMLButtonElement;
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.clouseButton.addEventListener('click', actions.onClick);
  }

  set total(value: number) {
    this.setText(this.descriptionElement, `Списано ${value} синапсов`)
  }
}