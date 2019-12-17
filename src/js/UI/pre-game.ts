import { AsyncRenderer, State } from "../lib/dom/async-renderer";
import { $ } from "dollarsigns";

class PreGameDialog {
  private element: HTMLElement;
  private renderer: AsyncRenderer;
  private starter: GameStarter;

  constructor(starter: GameStarter) {
    this.element = $("pre-game");
    this.starter = starter;
    this.renderer = new AsyncRenderer("templates/pre-game.ejs",
                                      this.element,
                                      this.update,
                                      this.bindEvents.bind(this));
  }

  public show(ship: string, port: string) {
    this.renderer.update({
      element: this.element,
      ship: ship,
      port: port
    });
  }

  private update(state: State) {
    state.element.classList.remove("hidden");
    $("pre-game-golden-ship").textContent = state.ship;
    $("pre-game-golden-port").textContent = state.port;
  }

  private bindEvents() {
    $("start-game").addEventListener("click", () => {
      this.element.classList.add("hidden");
      this.starter();
    });
  }
}

type GameStarter = () => void;

export { PreGameDialog };
