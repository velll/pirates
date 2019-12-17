import { Game } from '../game';
import { $ } from 'dollarsigns';
import { AsyncRenderer, State } from '../lib/dom/async-renderer';
import { each } from 'lodash';

class StatusPanel {
  private model: Game;
  private renderer: AsyncRenderer;

  private buttonHandlers: Record<string, () => void>;

  constructor(model: Game, buttonHandlers: Record<string, () => void>) {
    this.model = model;
    this.buttonHandlers = buttonHandlers;

    this.renderer = new AsyncRenderer("templates/status.ejs",
                                      $("status"),
                                      this.update,
                                      this.bindEvents.bind(this));
  }

  public report(turn: Reportable) {
    const ship = turn.ship;

    const state: State = {
      turnNo: turn.no.toString(),
      shipName: ship.name,
      shipHP: ship.HP.toString(),
      shipMaxHP: ship.maxHP.toString(),
      shipHPPercentage: Math.round(ship.HP * 100 / ship.maxHP).toString(),
      wind: turn.wind.description(),
      roseImg: `img/wind-rose-${ship.fleet.name}.png`
    };

    this.renderer.update(state);
  }

  private update(state: State) {
    $("status-turn-no").innerText = state.turnNo;
    $("status-active-ship").innerText = state.shipName;
    $("status-wind").innerText = state.wind;
    $("status-HP").innerText = state.shipHP;

    ($("status-rose-img") as HTMLImageElement).src = state.roseImg;

    const HPBarStyle = `linear-gradient(to top, rgba(51, 153, 0, 0.8) ${state.shipHPPercentage}%, red ${state.shipHPPercentage}%)`;
    $("status-hp-bar") .style.background = HPBarStyle;
  }

  private bindEvents() {
    each(this.buttonHandlers, (f, elementId) => (
      $(elementId).addEventListener("click", f)
    ));
  }
}

interface Describable {
  description(): string;
}

interface Reportable {
  no: number;
  wind: Describable;

  ship: {
    name: string;
    fleet: {
      name: string;
    };
    HP: number;
    maxHP: number;
  }
}

export { StatusPanel };
