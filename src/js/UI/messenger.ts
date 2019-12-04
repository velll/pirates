import { AsyncRenderer, State } from '../lib/dom/async-renderer';
import { DOM } from '../lib/dom/dom';

class Messenger {
  private renderer: AsyncRenderer;
  private element: HTMLElement;

  constructor() {
    this.element = DOM.$("message");

    this.renderer = new AsyncRenderer("templates/message.ejs",
                                      this.element,
                                      this.update,
                                      this.bindEvents.bind(this));
  }

  public send(header: string, text: string, flash = false) {
    const state: State = {
      header: header,
      text: text,
      flash: flash
    };

    this.renderer.update(state);
  }

  private update(state: State) {
    DOM.$("message-header-text").innerText = state.header;
    DOM.$("message-body-text").innerText = state.text;

    DOM.$("message").classList.remove("hidden");

    if (state.flash) {
      DOM.$("message").classList.add("flash");
    }
  }

  private bindEvents() {
    DOM.$("message-close").addEventListener("click", event => {
      DOM.$("message").classList.add("hidden");
    });

    DOM.$("message").addEventListener("transitionend", event => {
      (event.target as HTMLElement).classList.remove("flash");
      (event.target as HTMLElement).classList.add("hidden");
    });
  }
}

export { Messenger };
