import { Turn } from './turn';
import { Reportable } from '../game';
import { DOM } from '../lib/dom/dom'
import { AsyncRenderer, State } from '../lib/dom/async-renderer'

class Telemetry implements Reportable {
  public working: boolean;
  public ready: Promise<boolean>;
  
  private renderer: AsyncRenderer;

  private readonly TELEMETRY_DISPLAY = "block";

  constructor() {
    // you have to manually turn it on
    this.working = false;
    this.renderer = new AsyncRenderer("templates/telemetry.html",
                                      DOM.$("telemetry"),
                                      this.update)
  }

  public switchOn() {
    this.working = true;
    DOM.$("telemetry").style.display = this.TELEMETRY_DISPLAY;
  }

  public switchOff() {
    this.working = false;
    DOM.$("telemetry").style.display = "none";
  }

  public report(turn: Turn) {
    if (!this.working) { return }

    const state: State = {
      turnNo: turn.no.toString(),
      shipName: turn.ship.name,
      shipFleetName: turn.ship.fleet.name,
      shipHP: turn.ship.HP.toString(),
      shipMaxHP: turn.ship.maxHP.toString(),
      windName: turn.wind.getName(),
      windForce: turn.wind.getForce()
    }

    this.renderer.update(state);
  }

  private update(state: State) {
    DOM.$("telemetry-turn-no").innerText = state.turnNo;
    DOM.$("telemetry-active-ship").innerText = state.shipName;
    DOM.$("telemetry-active-fleet").innerText = state.shipFleetName;
    DOM.$("telemetry-HP").innerText = state.shipHP;
    DOM.$("telemetry-max-HP").innerText = state.shipMaxHP
    DOM.$("telemetry-wind").innerText = state.windName;
    DOM.$("telemetry-wind-force").innerText = state.windForce;
  }
}

export { Telemetry };
