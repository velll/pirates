import { Port } from "../board/port";
import { Ship } from "../game/ship";
import { Coordinates, GameMap } from "../board/gamemap";
import { Position } from "../lib/position";
import { DOM } from "../lib/dom/dom";
import { AsyncRenderer, State } from "../lib/dom/async-renderer";

class CellTip {
  private element: HTMLElement;
  private renderer: AsyncRenderer;
  private currentCell: Coordinates;

  constructor()  {
    this.element = DOM.$("cell-tip");
    this.currentCell = GameMap.dummyCell;

    this.renderer = new AsyncRenderer("templates/cell-tip.html",
                                      this.element,
                                      this.update);

    this.element.addEventListener("transitionend", this.hideCompletely);
  }

  public hasMoved(cell: Coordinates) {
    return !GameMap.isSameCell(cell, this.currentCell);
  }

  public render(cell: Coordinates, position: Position, port: Port, ship: Ship) {
    this.currentCell = cell;
    const state: State = {};

    if (port) {
      state.port = {
        flag: (port.view.flag as HTMLImageElement).src,
        name: port.name,
        nation: port.nation
      };
    }

    if (ship) {
      state.ship = {
        flag: (ship.fleet.flag as HTMLImageElement).src,
        name: ship.name,
        fleet: ship.fleet.name,
        HP: `${ship.HP}/${ship.maxHP}`
      };
    }

    state.occupied = state.ship && state.port;

    state.element = this.element;
    state.left = `${position.left}px`;
    state.top = `${position.top}px`;

    this.renderer.update(state);
    this.show();
  }

  public hide() {
    this.element.classList.add("transparent");
  }

  public isVisible() {
    return !this.element.classList.contains("hidden");
  }

  private show() {
    this.element.classList.remove("hidden");
    this.element.classList.remove("transparent");
  }

  private hideCompletely(event: TransitionEvent) {
    const target = event.target as HTMLElement;

    if (target.classList.contains("transparent")) {
      target.classList.add("hidden");
    }
  }

  private update(state: State) {
    if (state.port) {
      DOM.$$(".cell-tip .port-info-name").textContent = state.port.name;
      DOM.$$(".cell-tip .port-info-fleet").textContent = state.port.nation;
      (DOM.$$(".cell-tip .port-icon img") as HTMLImageElement).src = state.port.flag;
      DOM.$$(".cell-tip .port-info").style.display = "flex";
    } else {
      DOM.$$(".cell-tip .port-info").style.display = "none";
    }

    if (state.ship) {
      DOM.$$(".cell-tip .ship-info-name").textContent = state.ship.name;
      DOM.$$(".cell-tip .ship-info-fleet").textContent = state.ship.fleet;
      (DOM.$$(".cell-tip .ship-icon img") as HTMLImageElement).src = state.ship.flag;
      DOM.$$(".cell-tip .ship-info-HP").textContent = state.ship.HP;
      DOM.$$(".cell-tip .ship-info").style.display = "flex";
    } else {
      DOM.$$(".cell-tip .ship-info").style.display = "none";
    }

    DOM.$$(".occupied-by").style.display = state.occupied ?  "block" : "none";
    state.element.style.left = state.left;
    state.element.style.top = state.top;
  }
}

export { CellTip };
