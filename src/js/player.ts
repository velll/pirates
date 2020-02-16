import { Fleet } from "./game/fleet";
import { includes } from "./lib/includes";

class Player {
  constructor(private readonly fleets: Fleet[]) {
  }

  public canPlay(fleet: Fleet) {
    return includes(this.fleets, fleet);
  }

  // get a player fleet but only if it's the only one
  public getFleet(): Fleet {
    if (this.fleets.length > 1) { return null; }

    return this.fleets[0];
  }
}

export { Player };
