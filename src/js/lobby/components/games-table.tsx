import * as React from "react";

import { GameRow } from './game-row';
import { NewGameDropDown } from './new-game-dropdown';

import { LobbyGame } from "../../lobby";
import { Fleet } from "../../game/fleet";
import { t } from "../../data/i18n";

class GamesTable extends React.Component<Props, State>  {
  private readonly FETCH_INTERVAL = 3000;
  private readonly boundFetch: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {games: []};
    this.boundFetch = this.fetch.bind(this);
  }

  public async componentDidMount() {
    this.boundFetch();
  }

  public render() {
   return <table className="table">
            <thead>
              <tr>
                <th> { t("lobby.game") } </th>
                <th> { t("lobby.created-by") } </th>
                <th> { t("lobby.created-at") } </th>
                <th>
                  <NewGameDropDown starter={ this.props.starter } />
                </th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.games.map((game, key) => (
                  <GameRow game_id={game.id}
                           fleet={game.fleet}
                           created_at={game.created_at}
                           join_as={game.join_as}
                           joiner={ () => this.props.joiner(game.id)  }
                           key={key} />
                ))
              }
            </tbody>
          </table>;
  }

  private fetch() {
    this.props.fetcher().then(games => this.setState({games: games}));

    setTimeout(this.boundFetch, this.FETCH_INTERVAL);
  }
}

interface Props {
  fetcher: () => Promise<LobbyGame[]>;
  starter: (fleet: string) => void;
  joiner: (game: string) => void;
}

interface State {
  games: LobbyGame[]
}

export { GamesTable };
