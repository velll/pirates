import { Game } from '../game';
import { Ship } from './ship';
import { Board } from '../board';
import { HTTPAdapter } from '../api/adapters/api';
import { spaniards, pirates, Fleet } from './fleet';
import { FetchGame } from '../api/game/fetch-game';
import { Player } from '../player';
import { logger } from '../lib/logger';
import { GameController } from '../controllers/game-controller';

class GameBuilder {
  public readonly player: Player;

  constructor(private readonly api: HTTPAdapter, playerFleet: string) {
    this.player = this.buildPlayer(playerFleet);
  }

  public async build(id: string, board: Board, ships: Ship[]): Promise<Game> {
    const remoteGame = await new FetchGame(this.api).call({id: id});
    this.loadGold(ships, remoteGame.golden_ship);

    return new Game(this.api, id, this.player, board, ships);
  }

  public buildPlayer(playerFleet: string) {
    logger.debug(`building a player with fleet ${playerFleet}`);

    const fleets = playerFleet ? [Fleet.find(playerFleet)] : [spaniards, pirates];
    return new Player(fleets);
  }

  public buildController(game: Game): GameController {
    return new GameController(game, this.player);
  }

  private loadGold(ships: Ship[], goldenShip: number) {
    const spanishShips = ships.filter(ship => ship.fleet.is(spaniards));

    spanishShips[goldenShip].loadGold();
  }
}

export { GameBuilder };
