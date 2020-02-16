import * as React from "react";
import { t } from '../../../data/i18n';
import './wait-screen.css';

class WaitScreen extends React.Component<{}, {hidden: boolean, fleet: string}> {
  constructor(props: {}) {
    super(props);

    // show pirate emblem by default cause it's cooler
    this.state = {hidden: true, fleet: 'pirates'};
  }

  public hide() {
    this.setState({hidden: true});
  }

  public show(fleetCode: string) {
    this.setState({hidden: false, fleet: fleetCode});
  }

  public render() {
    return <div className={`wait-screen ${this.state.hidden ? 'hidden' : ''}`}>
              <img src={ `img/wind-rose-${ this.state.fleet}.png` }/>
              <h1> { t("messages.turn", {fleet: t(`fleets.${this.state.fleet}`) }) }</h1>
          </div>;
  }
}

export { WaitScreen };
