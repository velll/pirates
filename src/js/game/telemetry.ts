import { Turn } from './turn';
import { Reportable } from '../game';
import { $ } from 'dollarsigns';
import { AsyncRenderer, State } from '../lib/dom/async-renderer';

class Telemetry implements Reportable {
  public working: boolean;

  private renderer: AsyncRenderer;

  private readonly TELEMETRY_DISPLAY = "block";

  constructor() {
    // you have to manually turn it on
    this.working = false;
    this.renderer = new AsyncRenderer("templates/telemetry.ejs",
                                      $("telemetry"),
                                      this.update);
  }

  public switchOn() {
    this.working = true;
    $("telemetry").style.display = this.TELEMETRY_DISPLAY;
  }

  public switchOff() {
    this.working = false;
    $("telemetry").style.display = "none";
  }

  public report(turn: Turn) {
    if (!this.working) { return; }

    const state: State = {
      turnNo: turn.no.toString(),
      shipName: turn.ship.name,
      shipFleetName: turn.ship.fleet.name,
      shipHP: turn.ship.HP.toString(),
      shipMaxHP: turn.ship.maxHP.toString(),
      windName: turn.wind.getName(),
      windForce: turn.wind.getForce()
    };

    this.renderer.update(state);
  }

  private update(state: State) {
    $("telemetry-turn-no").innerText = state.turnNo;
    $("telemetry-active-ship").innerText = state.shipName;
    $("telemetry-active-fleet").innerText = state.shipFleetName;
    $("telemetry-HP").innerText = state.shipHP;
    $("telemetry-max-HP").innerText = state.shipMaxHP;
    $("telemetry-wind").innerText = state.windName;
    $("telemetry-wind-force").innerText = state.windForce;
  }
}

export { Telemetry };
