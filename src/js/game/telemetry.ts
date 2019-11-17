import { Turn } from './turn';
import { Reportable } from '../game';

class Telemetry implements Reportable {
  public working: boolean;
  private readonly TELEMETRY_DISPLAY = "block";

  constructor() {
    // you have to manually turn it on
    this.working = false;
  }

  public switchOn() {
    this.working = true;
    document.getElementById("telemetry").style.display = this.TELEMETRY_DISPLAY;
  }

  public switchOff() {
    this.working = false;
    document.getElementById("telemetry").style.display = "none";
  }

  public report(turn: Turn) {
    document.getElementById("telemetry-turn-no").innerText = turn.no.toString();
    document.getElementById("telemetry-active-ship").innerText = turn.ship.name;
    document.getElementById("telemetry-active-fleet").innerText = turn.ship.fleet;
    document.getElementById("telemetry-HP").innerText = turn.ship.HP.toString();
    document.getElementById("telemetry-max-HP").innerText = turn.ship.maxHP.toString();
    document.getElementById("telemetry-wind").innerText = turn.wind.getName();
    document.getElementById("telemetry-wind-force").innerText = turn.wind.getForce();
  }
}

export { Telemetry };
