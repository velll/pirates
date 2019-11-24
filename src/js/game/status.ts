import { Game } from '../game';
import { DOM } from '../lib/dom/dom';
import { AsyncRenderer, State } from '../lib/dom/async-renderer';

class GameStatus {
  private model: Game;
  private renderer: AsyncRenderer;

  constructor(model: Game) {
    this.model = model;

    this.renderer = new AsyncRenderer("templates/status.html",
                                      DOM.$("status"),
                                      this.update);
  }

  public report() {
    const turn = this.model.getCurrentTurn();
    const ship = turn.ship;

    const state: State = {
      turnNo: turn.no.toString(),
      shipName: ship.name,
      shipHP: ship.HP.toString(),
      shipMaxHP: ship.maxHP.toString(),
      shipHPPercentage: Math.round(ship.HP * 100 / ship.maxHP).toString(),
      windName: turn.wind.getName(),
      windForce: turn.wind.getForce(),
      roseImg: `img/wind-rose-${ship.fleet.name}.png`
    };

    this.renderer.update(state);
  }

  private update(state: State) {
    DOM.$("status-turn-no").innerText = state.turnNo;
    DOM.$("status-active-ship").innerText = state.shipName;
    DOM.$("status-wind").innerText = state.windName;
    DOM.$("status-wind-force").innerText = state.windForce;
    DOM.$("status-HP").innerText = state.shipHP;

    (DOM.$("status-rose-img") as HTMLImageElement).src = state.roseImg;

    const HPBarStyle = `linear-gradient(to top, rgba(51, 153, 0, 0.8) ${state.shipHPPercentage}%, red ${state.shipHPPercentage}%)`;
    DOM.$("status-hp-bar") .style.background = HPBarStyle;
  }
}

export { GameStatus };
