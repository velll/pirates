class Fleet {
  public name: string;
  public playable: boolean;

  constructor(name: string, playable: boolean) {
     this.name = name;
     this.playable = playable;
  }

  public static getEnemyFleet(fleet: Fleet) {
    if (fleet.is(spaniards)) {
      return pirates;
    } else if (fleet.is(pirates)) {
      return spaniards;
    } else {
      throw Error("Unknown fleet " + fleet);
    }
  }

  public is(fleet: Fleet) {
    return this.name == fleet.name
  }

  public isHostileTo(fleet: Fleet) {
    return this.playable && fleet.playable && this.name != fleet.name;
  }

  public isFriendlyTo(fleet: Fleet) {
    return !this.isHostileTo(fleet);
  }
}

const spaniards = new Fleet("spaniards", true)
const pirates = new Fleet("pirates", true)
const neutrals = new Fleet("neutrals", false)

export { Fleet, spaniards, pirates, neutrals }