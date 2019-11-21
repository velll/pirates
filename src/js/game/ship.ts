import { Coordinates } from "../lib/coordinates";
import { Moveable } from "../game";
import { GameMap } from "../board/gamemap";
import { Wind } from "./wind";
import { ShipView } from "../views/ship";
import { getRange } from "./rules/moving";
import { Design } from "../shipyard";

class Ship implements Moveable {
  public type: ShipType;
  public fleet: string;
  public name: string;

  public coordinates: Coordinates;
  public status: ShipStatus;
  public carriesGold: boolean;

  public HP: number;
  public maxHP: number;

  public view: ShipView;

  private readonly HP_VALUES: Record<ShipType, number> = {
    galleon: 30, brigantine: 20
  };

  private readonly SHOT_RANGE: Record<ShipType, number> = {
    galleon: 2, brigantine: 1
  };

  constructor(type: ShipType, fleet: string, name: string,
              initialCoordinates: Coordinates, icons: Design[],
              carriesGold: boolean = false) {
    this.type = type;
    this.fleet = fleet;
    this.name = name;

    this.coordinates = initialCoordinates;
    this.carriesGold = carriesGold;
    this.status = ShipStatus.ready;

    this.maxHP = this.HP_VALUES[type];
    this.HP = this.HP_VALUES[type];

    this.view = new ShipView(this, icons);
  }

  public move(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }

  public damage(dmg: number) {
    this.HP -= dmg;
    if (this.status == ShipStatus.ready && this.HP <= 0) { this.wreck(); }
  }

  public wreck() { this.status = ShipStatus.sinking; }
  public sink() { this.status = ShipStatus.sunk; }

  public isReady(): boolean { return this.status == ShipStatus.ready; }
  public isWrecked(): boolean { return this.status == ShipStatus.sinking; }
  public isSunk(): boolean { return this.status == ShipStatus.sunk; }

  public isFriendlyTo(other: Ship): boolean { return this.fleet == other.fleet; }
  public isHostileTo(other: Ship): boolean { return !this.isFriendlyTo(other); }

  public getHitPoints() {
    return {current: this.HP, max: this.maxHP};
  }

  // I'm not proud of this
  public getMovingRange(wind: Wind): Coordinates[] {
    return getRange(wind, this.type, this.coordinates);
  }

  public getShootingRange(): Coordinates[] {
    return GameMap.getCellsAround(this.coordinates, this.SHOT_RANGE[this.type]);
  }
}

enum ShipType {
  brigantine = "brigantine",
  galleon = "galleon"
}

enum ShipStatus {
  ready,
  sinking,
  sunk
}

export { Ship, ShipType };
