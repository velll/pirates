
import { Coordinates } from "../../lib/coordinates";
import { GameMap } from "../../board/gamemap";
import { Wind } from "../wind";
import { Vector2d } from "../../lib/vector-2d";
import { ShipType } from "../ship";

// I'm not proud of this
function getRange(wind: Wind, shipType: ShipType, coordinates: Coordinates): Coordinates[] {
  const where  = coordinates;
  const windVector = new Vector2d(wind.direction);
  const aft    = {x: where.x - windVector.x, y: where.y - windVector.y};

  // Every ship can move to a cell next to it
  const around = GameMap.getCellsAround(where);
  let closeCells: Coordinates[];

  // Except only brigantines can go directly into the wind, galleons cannot.
  if (shipType == ShipType.brigantine) {
    closeCells = around;
  } else {
    closeCells = around.filter(cell => {
      return !(cell.x == aft.x && cell.y == aft.y);
    });
  }

  // Ships can move up to three cells downwind
  const downwind = [
    {x: where.x + 2 * windVector.x,      y: where.y + 2 * windVector.y},
    {x: where.x + 3 * windVector.x,      y: where.y + 3 * windVector.y}
  ];

  // Only two cells on a tacking course (90 deg to the wind)
  const leftTack = windVector.rotate(-90);
  const rightTack = windVector.rotate(90);

  const tack = [
    {x: where.x + 2 * leftTack.x,      y: where.y + 2 * leftTack.y},
    {x: where.x + 2 * rightTack.x,     y: where.y + 2 * rightTack.y}
  ];

  // Three sells on a running course (45 deg each way from downwind)
  const leftRun = windVector.rotate(-45);
  const rightRun = windVector.rotate(45);

  const run = [
    {x: where.x + 2 * leftRun.x,       y: where.y + 2 * leftRun.y},
    {x: where.x + 3 * leftRun.x,       y: where.y + 3 * leftRun.y},
    {x: where.x + 2 * rightRun.x,      y: where.y + 2 * rightRun.y},
    {x: where.x + 3 * rightRun.x,      y: where.y + 3 * rightRun.y}
  ];

  return closeCells.concat(downwind, tack, run);
}

export { getRange };
