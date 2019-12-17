import { AsyncRenderer, State } from "../lib/dom/async-renderer";
import { DOM } from "../lib/dom/dom";

class HelpDialog {
  private element: HTMLElement;
  private renderer: AsyncRenderer;

  constructor() {
    this.element = DOM.$("help");
    this.renderer = new AsyncRenderer("templates/help.ejs",
                                      this.element,
                                      this.update,
                                      this.bindEvents.bind(this));
  }

  public show() {
    this.renderer.update({
      element: this.element
    });
  }

  private update(state: State) {
    state.element.classList.remove("hidden");
  }

  private showChapter(chapter: string) {
    DOM.$$(".help-body .active-chapter").classList.remove("active-chapter");
    DOM.$(`help-chapter-${chapter}`).classList.add("active-chapter");
  }

  private bindEvents() {
    DOM.$("help-close").addEventListener("click", event => {
      DOM.$("help").classList.add("hidden");
    });

    DOM.$$$(".menu-list a").forEach(el => {
      el.addEventListener("click", () => {
        this.showChapter(el.getAttribute("data-help-chapter"));
      });
    });
  }

}

export { HelpDialog };
