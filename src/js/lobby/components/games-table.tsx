import * as React from "react";

import { GameRow } from './game-row';
import { LobbyGame } from "../../lobby";

class GamesTable extends React.Component<Props, State>  {
  constructor(props: Props) {
    super(props);

    this.state = {games: []};
  }

  public componentDidMount() {
    this.props.fetcher().then(games => this.setState({games: games}));
  }

  public render() {
   return <table className="table">
            <thead>
              <tr>
                <th>Game id</th>
                <th>Game started by</th>
                <th>Game started at</th>
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
