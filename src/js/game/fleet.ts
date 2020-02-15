import { t } from '../data/i18n';

class Fleet {
  public static getEnemyFleet(fleet: Fleet): Fleet {
    if (!fleet.is(spaniards) && !fleet.is(pirates)) {
      throw Error("Unknown fleet " + fleet.code);
    }

    return fleet.is(pirates) ? spaniards : pirates;
  }

  public static find(fleetCode: string) {
    const found = [spaniards, pirates, neutrals].find(fleet => fleet.code == fleetCode);

    if (!found) {
      throw Error("Unknown fleet " + fleetCode);
    }

    return found;
  }

  public flag: CanvasImageSource;

  constructor(public readonly code: string,
              public readonly name: string,
              public readonly playable: boolean) {
  }

  public is(fleet: Fleet) {
    return this.code == fleet.code;
  }

  public isHostileTo(fleet: Fleet) {
    return this.playable && fleet.playable && this.code != fleet.code;
  }

  public isFriendlyTo(fleet: Fleet) {
    return !this.isHostileTo(fleet);
  }

  public getEnemyFleet() {
    return Fleet.getEnemyFleet(this);
  }
}

const spaniards = new Fleet('spaniards', t("fleets.spaniards"), true);
const pirates   = new Fleet('pirates',   t("fleets.pirates"),   true);
const neutrals  = new Fleet('neutrals',  t("fleets.neutrals"),  false);

export { Fleet, spaniards, pirates, neutrals };
