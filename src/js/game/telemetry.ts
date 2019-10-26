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
    document.getElementById("turn-no").innerText = turn.no.toString();
    document.getElementById("active-ship").innerText = turn.ship.name;
    document.getElementById("active-fleet").innerText = turn.ship.fleet;
  }
}

export { Telemetry };
