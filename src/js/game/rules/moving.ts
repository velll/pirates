
import { Coordinates } from "../../lib/coordinates";
import { GameMap } from "../../board/gamemap";
import { Wind } from "../wind";
import { Vector2d } from "../../lib/vector-2d";
import { ShipType } from "../ship";
import { range, concat } from 'lodash';

// Let me tell you what this does real quick
/*

 Close haul  _             Tack            _  Run
            |\               /|\           /|
              \               |           /
               \              |          /
                \             |
                             /|___
                           ///|   ))
                         /////|   )))
                       ///////|    )))
 ------\             /////////|     )))
  WIND  ->         ///////////|     ))))          -----> Downwind
 ------/         /////////////|     )))
                //////////////|    )))
              ////////////////|___)))
                ______________|________
                \                    /
              ~~~~~~~~~~~~~~~~~~~~~~~~~~
               /              |          \
              /               |           \
            |/_              \|/          _\|
 Close haul                 Tack          Run

getRange() makes sure you get 3 cells downwind and on a running course
                              2 cells on a tacking course
                              1 cell on a close-haul
                              0 into the wind (but 1 for a brigantine for whatever reason)
                                               rules, I guess

 */

function getCellsBetween(first: Coordinates, second: Coordinates): Coordinates[] {
  if (first.x == second.x) {
    return range(Math.min(first.y, second.y), Math.max(first.y, second.y) + 1).map(el => (
      {x: first.x, y: el}
    ));
  } else if (first.y == second.y) {
    return range(Math.min(first.x, second.x), Math.max(first.x, second.x) + 1).map(el => (
      {x: el, y: first.y}
    ));
  }
}

// I'm not proud of this
function getRange(wind: Wind, shipType: ShipType, where: Coordinates): Coordinates[] {
  const windVector = new Vector2d(wind.direction);
  const aft = windVector.apply(where, -1);

  // Every ship can move to a cell next to it
  let around;

  // Except only brigantines can go directly into the wind, galleons cannot.
  if (shipType == ShipType.brigantine) {

    around = GameMap.getCellsAround(where);
  } else {
    around = GameMap.getCellsAround(where).filter(cell => (
       !(cell.x == aft.x && cell.y == aft.y)
    ));
  }

  const leftTack = windVector.rotate(-90);
  const rightTack = windVector.rotate(90);

  const leftRun = windVector.rotate(-45);
  const rightRun = windVector.rotate(45);

  return concat(
           // close-hauling one cell only
           around,
           // Tacking is 2 cells
           getCellsBetween(leftTack.apply(where, 2), leftRun.apply(where, 2)),
           getCellsBetween(rightTack.apply(where, 2), rightRun.apply(where, 2)),
           // Running course and downwind — three cells
           getCellsBetween(leftRun.apply(where, 2), windVector.apply(where, 2)),
           getCellsBetween(rightRun.apply(where, 2), windVector.apply(where, 2)),
           getCellsBetween(leftRun.apply(where, 3), windVector.apply(where, 3)),
           getCellsBetween(rightRun.apply(where, 3), windVector.apply(where, 3))
         );
}

export { getRange };
