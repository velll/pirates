import { orders as ships} from '../../../data/ships';
import { WindGenerator } from '../../../game/wind-generator';

function offlineFetchTurn(params: {game_id: string, turn_no: string}) {
  const activeShipIndex = parseInt(params.turn_no, 10) % ships.length;
  const wind = new WindGenerator().getRandomWind();

  return {
    game_id: params.game_id,
    no: params.turn_no,
    fleet: ships[activeShipIndex].fleet.name,
    ship_id: activeShipIndex,
    wind_bearing: wind.bearing,
    wind_force: wind.forceValue
  };
}

export { offlineFetchTurn };
