import { getRndInt } from '../lib/rnd-int';
import { Wind, ForceScale } from "./wind";

class WindGenerator {
  private readonly FORCE_ROLL_D = 6;

  public getRandomWind() {
    const bearing = Wind.BEARINGS[getRndInt(Wind.BEARINGS.length)];
    const force = this.rollWindForce();

    return this.getWind(bearing, force);
  }

  public getBreeze(bearing: string) {
    return this.getWind(bearing, ForceScale.breeze);
  }

  public getWind(bearing: string, force: ForceScale) {
    return new Wind(Wind.DIRECTIONS[bearing], force);
  }

  private rollWindForce(): ForceScale {
    const forceRoll = getRndInt(this.FORCE_ROLL_D);

    let force: ForceScale;

    if (forceRoll == 0) {
      force = ForceScale.calm;
    } else if (forceRoll == 1) {
      force = ForceScale.storm;
    } else {
      force = ForceScale.breeze;
    }

    return force;
  }
}

export { WindGenerator };
