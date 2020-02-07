import { Fleet } from "./game/fleet";
import { includes } from "./lib/includes";

class Player {
  constructor(private readonly fleets: Fleet[]) {
  }

  public canPlay(fleet: Fleet) {
    return includes(this.fleets, fleet);
  }
}

export { Player };
