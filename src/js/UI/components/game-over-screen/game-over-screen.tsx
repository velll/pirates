import * as React from "react";
import { t } from '../../../data/i18n';
import './game-over-screen.css';

interface Props {
  code: string;
  name: string;
}

class GameOverScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return <div className="fullscreen-overlay">
              <img src={ `img/wind-rose-${ this.props.code}.png` }/>
              <h1 className="Title"> { t("game-over.won", {winner: this.props.name }) }</h1>
              <a onClick={ this.newGame } className="button is-light is-large">{ t("game-over.new-game")}</a>
          </div>;
  }

  private newGame() {
    window.location.reload(true);
  }
}

export { GameOverScreen };
