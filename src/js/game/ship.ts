import { Coordinates } from "../lib/coordinates";
import { GameMap } from "../board/gamemap";
import { Wind } from "./wind";
import { ShipView } from "../views/ship";
import { getRange } from "./rules/moving";
import { Design } from "../shipyard";
import { Fleet } from "./fleet";
import { assert } from "../lib/assert";

class Ship {
  public type: ShipType;
  public fleet: Fleet;
  public name: string;

  public carriesGold: boolean;

  public coordinates: Coordinates;

  public HP: number;
  public maxHP: number;

  public view: ShipView;

  private status: ShipStatus;
  private goldDiscovered: boolean = true;

  private readonly HP_VALUES: Record<ShipType, number> = {
    galleon: 30, brigantine: 20
  };

  private readonly SHOT_RANGE: Record<ShipType, number> = {
    galleon: 2, brigantine: 1
  };

  private readonly DAMAGE_BY = 10;
  private readonly REPAIR_BY = 10;

  constructor(type: ShipType, fleet: Fleet, name: string,
              initialCoordinates: Coordinates, icons: Design[]) {
    this.type = type;
    this.fleet = fleet;
    this.name = name;

    this.coordinates = initialCoordinates;
    this.status = ShipStatus.ready;

    this.maxHP = this.HP_VALUES[type];
    this.HP = this.HP_VALUES[type];

    this.view = new ShipView(this, icons);
    this.carriesGold = false;
  }

  public move(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }

  public damage() {
    this.HP -= this.DAMAGE_BY;
    if (this.status == ShipStatus.ready && this.HP <= 0) { this.wreck(); }
  }

  public wreck() {
    this.status = ShipStatus.wrecked;

    if (this.carriesGold) {
      this.goldDiscovered = true;
    }
  }

  public sink() {
    if (!this.carriesGold) {  // Cannot sink if carries gold
      this.status = ShipStatus.sunk;
    }
  }

  public repair() {
    this.HP = Math.min(this.HP + this.REPAIR_BY, this.maxHP);

    if (this.isWrecked()) {
      this.status = ShipStatus.ready;
    }
  }

  public surrender(fleet: Fleet) {
    assert(this.carriesGold, "only ships carrying gold can surrender");

    this.fleet = fleet;
    this.repair();
  }

  public loadGold() {
    this.carriesGold = true;
  }

  public isReady(): boolean { return this.status == ShipStatus.ready; }
  public isWrecked(): boolean { return this.status == ShipStatus.wrecked; }
  public isSunk(): boolean { return this.status == ShipStatus.sunk; }

  public isGolden(): boolean { return this.carriesGold && this.goldDiscovered; }

  public isFriendlyTo(other: Ship): boolean { return this.fleet.isFriendlyTo(other.fleet); }
  public isHostileTo(other: Ship): boolean { return !this.isFriendlyTo(other); }

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
  wrecked,
  sunk
}

export { Ship, ShipType };
