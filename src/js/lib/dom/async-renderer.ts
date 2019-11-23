/*
A very basic mechanism for asynchronously rendering an html remplate.
To render an object provide:
  - a URL to a template (html)
  - a root element
  - an `updater` — a function that's gonna update contents of the template
An updater is a callback — it must accept a single parameter of a type State (down below)
*/
class AsyncRenderer {
  private templateURL: string;
  private root: HTMLElement;
  private updater: Updater;

  private ready: Promise<boolean>;

  constructor(templateURL: string, root: HTMLElement, updater: Updater) {
    this.templateURL = templateURL;
    this.root = root;
    this.updater = updater;

    this.ready = this.initializeElement();
  }

  public async initializeElement() {
    const response = await fetch(this.templateURL);
    this.root.innerHTML = await response.text();
    return true;
  }

  public async update(state: State) {
    if (await this.ready) { this.updater(state); }
  }
}

type State = Record<string, any>;

type Updater = (state: State) => void;

export { AsyncRenderer, State };
