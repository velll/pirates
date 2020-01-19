import * as React from "react";

import './status-panel.css';

class StatusPanel extends React.Component<Props, State>  {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: true,
      roseImg: "img/wind-rose-spaniards.png"
    };
  }

  public toggleCollapse() {
    this.setState(state => ({collapsed: !state.collapsed}));
  }

  public report(turn: Reportable) {
    const ship = turn.ship;

    const shipHPPercentage = Math.round(ship.HP * 100 / ship.maxHP).toString();

    this.setState({
      turnNo: turn.no.toString(),
      dateWOYear: turn.date.toLocaleDateString('en', {month: 'short', day: 'numeric' }),
      date: turn.date.toLocaleDateString('en', {year: 'numeric', month: 'short', day: 'numeric' }),
      shipName: ship.name,
      shipHP: ship.HP.toString(),
      shipMaxHP: ship.maxHP.toString(),
      shipHPPercentage: shipHPPercentage,
      wind: turn.wind.description(),
      roseImg: `img/wind-rose-${ship.fleet.name}.png`,
      smallFlag: `img/flags/${ship.fleet.name}.png`,
      HPBarStyle: `linear-gradient(to top, rgba(51, 153, 0, 0.8) ${shipHPPercentage}%, red ${shipHPPercentage}%)`
    });
  }

  public render() {
    return <div>
            <a id='status-chevron' onClick={ this.toggleCollapse.bind(this) }>
              <i className='fa fa-chevron-down'></i>
            </a>
            <div className={`status-collapsed-row ${ this.state.collapsed ? '' : 'collapse'}`}>
              <img id="status-collapsed-flag" className="icon" src={ this.state.smallFlag }/>
              <span id="status-collapsed-date">{ this.state.date }</span>
           </div>
            <div className={`status-full ${ this.state.collapsed ? 'collapse' : ''}`}>
              <div className="rose">
                  <img id="status-rose-img" src={ this.state.roseImg }/>
              </div>
              <div id="details">
                  <div className="lower-rose-corners">
                      <h1>1624</h1>
                      <div id="status-hp-bar" className="bar" style={{ background: this.state.HPBarStyle }} ></div>
                  </div>
                  <div className="line head-line">
                      <h1 id="status-date">{ this.state.dateWOYear }</h1>
                      <h1><span id="status-HP">{ this.state.shipHP }</span> HP</h1>
                  </div>
                  <div className="line">
                      <div>
                          <img className="icon" src="icons/windsock.svg"/>
                          <span id="status-wind">{ this.state.wind }</span>
                      </div>
                      <div>
                          <img className="icon" src="icons/sail.svg"/>
                          <span id="status-active-ship">{ this.state.shipName }</span>
                      </div>
                  </div>
              </div>
              <div id="buttons">
                  <button onClick={this.props.buttonHandlers["button-next-turn"]}
                          className="button is-warning is-light">
                    <i className="far fa-hourglass"></i>
                  </button>
                  <button onClick={this.props.buttonHandlers["button-repair"]}
                          className="button is-warning is-light">
                    <i className="fas fa-hammer"></i>
                  </button>
                  <button onClick={this.props.buttonHandlers["button-surrender"]}
                          className="button is-warning is-light">
                    <i className="far fa-flag"></i>
                  </button>
                  <button onClick={this.props.buttonHandlers["button-help"]}
                          className="button is-warning is-light">
                    <i className="far fa-question-circle"></i>
                  </button>
              </div>
            </div>
          </div>;
  }
}

interface Props {
  buttonHandlers: Record<string, () => void>;
}

interface State {
  collapsed: boolean;
  turnNo?: string,
  dateWOYear?: string,
  date?: string,
  shipName?: string,
  shipHP?: string,
  shipMaxHP?: string,
  shipHPPercentage?: string,
  wind?: string,
  roseImg?: string,
  smallFlag?: string,
  HPBarStyle?: string
}

interface Describable {
  description(): string;
}

interface Reportable {
  no: number;
  date: Date;
  wind: Describable;

  ship: {
    name: string;
    fleet: {
      name: string;
    };
    HP: number;
    maxHP: number;
  }
}

export { StatusPanel, Reportable };
