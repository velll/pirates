import { Fleet } from "./game/fleet";
import { includes } from "./lib/includes";

class Player {
  constructor(private readonly fleets: Fleet[]) {
  }

  public canPlay(fleet: Fleet) {
    return includes(this.fleets, fleet);
  }

  // get the player fleet but only if there's a SINGLE fleet
  // Will return null in a hot seat game where a single player can play all fleets
  public getFleet(): Fleet {
    if (this.fleets.length > 1) { return null; }

    return this.fleets[0];
  }

  public getFleetCode(): string {
    const fleet = this.getFleet();
    return  fleet ? fleet.code : null;
  }
}

export { Player };
