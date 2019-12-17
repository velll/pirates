import { AsyncRenderer, State } from '../lib/dom/async-renderer';
import { $ } from 'dollarsigns';

class Messenger {
  private renderer: AsyncRenderer;
  private element: HTMLElement;

  constructor() {
    this.element = $("message");

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
    $("message-header-text").innerText = state.header;
    $("message-body-text").innerText = state.text;

    $("message").classList.remove("hidden");

    if (state.flash) {
      $("message").classList.add("flash");
    }
  }

  private bindEvents() {
    $("message-close").addEventListener("click", event => {
      $("message").classList.add("hidden");
    });

    $("message").addEventListener("transitionend", event => {
      (event.target as HTMLElement).classList.remove("flash");
      (event.target as HTMLElement).classList.add("hidden");
    });
  }
}

export { Messenger };
