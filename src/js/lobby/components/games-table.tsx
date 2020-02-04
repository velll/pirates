import * as React from "react";

import { GameRow } from './game-row';
import { LobbyGame } from "../../lobby";
import { Fleet } from "../../game/fleet";
import { t } from "../../data/i18n";

class GamesTable extends React.Component<Props, State>  {
  constructor(props: Props) {
    super(props);

    this.state = {games: []};
  }

  public async componentDidMount() {
    this.props.fetcher().then(games => this.setState({games: games}));
  }

  public render() {
   return <table className="table">
            <thead>
              <tr>
                <th> { t("lobby.game") } </th>
                <th> { t("lobby.created-by") } </th>
                <th> { t("lobby.created-at") } </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { this.state.games.map(game => React.createElement(GameRow, game)) }
            </tbody>
          </table>;
  }
}

interface Props {
  fetcher: () => Promise<LobbyGame[]>;
}

interface State {
  games: LobbyGame[]
}

export { GamesTable };
