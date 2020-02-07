import { getRndInt } from '../lib/rnd-int';
import { Wind, ForceScale } from "./wind";

class WindGenerator {
  public getRandomWind() {
    const bearing = Wind.BEARINGS[getRndInt(Wind.BEARINGS.length)];
    const force = getRndInt(Wind.SCALE.length);

    return new Wind(bearing, force);
  }

  public getBreeze(bearing: string) {
    return this.getWind(bearing, ForceScale.breeze);
  }

  public getWind(bearing: string, force: ForceScale) {
    const forceValue = Wind.SCALE.find(val => val == force);

    return new Wind(bearing, forceValue);
  }
}

export { WindGenerator };
