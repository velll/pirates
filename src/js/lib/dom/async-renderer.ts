/*
A very basic mechanism for asynchronously rendering an html remplate.
To render an object provide:
  - a URL to a template (html)
  - a root element
  - an `updater` — a function that's gonna update contents of the template
An updater is a callback — it must accept a single parameter of a type State (down below)
*/
import { template } from 'lodash';

class AsyncRenderer {
  private templateURL: string;
  private root: HTMLElement;
  private updater: Updater;
  private afterInit: Procedure;

  private ready: Promise<boolean>;

  constructor(templateURL: string, root: HTMLElement, updater: Updater, afterInit: Procedure = null) {
    this.templateURL = templateURL;
    this.root = root;
    this.updater = updater;
    this.afterInit = afterInit;

    this.ready = this.initializeElement();
  }

  public async update(state: State) {
    if (await this.ready) { this.updater(state); }
  }

  private async initializeElement() {
    const templateText = await fetch(this.templateURL).then(response => response.text());
    const compiled = template(templateText);

    this.root.innerHTML = compiled();

    if (this.afterInit) { this.afterInit(); }

    return true;
  }
}

type State = Record<string, any>;

type Updater = (state: State) => void;
type Procedure = () => void;

export { AsyncRenderer, State };
