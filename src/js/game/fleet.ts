import { t } from '../data/i18n';

class Fleet {

  public static getEnemyFleet(fleet: Fleet) {
    if (fleet.is(spaniards)) {
      return pirates;
    } else if (fleet.is(pirates)) {
      return spaniards;
    } else {
      throw Error("Unknown fleet " + fleet);
    }
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
}

const spaniards = new Fleet('spaniards', t("fleets.spaniards"), true);
const pirates   = new Fleet('pirates',   t("fleets.pirates"),   true);
const neutrals  = new Fleet('neutrals',  t("fleets.neutrals"),  false);

export { Fleet, spaniards, pirates, neutrals };
