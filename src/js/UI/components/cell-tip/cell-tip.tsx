import * as React from "react";
import './cell-tip.css';

import { MediaObject } from './media-object';

import { Coordinates } from "../../../lib/coordinates";
import { Port } from "../../../board/port";
import { Ship } from "../../../game/ship";
import { GameMap } from "../../../board/gamemap";
import { Position } from "../../../lib/position";

class CellTip extends React.Component<Props, State>  {
  constructor(props: Props) {
    super(props);

    this.state = {
      visible: false,
      cell: GameMap.dummyCell,
      occupied: false,
      left: '0px',
      top: '0px'
    };
  }

  public isSameCell(cell: Coordinates) {
    return GameMap.isSameCell(cell, this.state.cell);
  }

  public update(cell: Coordinates, position: Position, port: Port, ship: Ship) {
    // only actually do something when a cell has changed
    if (this.isSameCell(cell)) { return; }

    const visible = !!(port || ship);

    let currentPort;
    if (port) {
      currentPort = {
            name: port.name,
            nation: port.nation,
            flag: (port.view.flag as HTMLImageElement).src};
    }

    let currentShip;
    if (ship) {
      currentShip = {
          name: ship.name,
          fleet: ship.fleet.name,
          flag: (ship.fleet.flag as HTMLImageElement).src,
          HP: `${ship.HP}/${ship.maxHP} HP`
      };
    }

    this.setState(
      {
        visible: visible,
        cell: cell,

        occupied: !!(port && ship),

        left: `${ position.left }px`,
        top: `${ position.top }px`,

        ship: currentShip,
        port: currentPort
      }
    );
  }

  public componentDidUpdate() {
    this.props.container.style.left = this.state.left;
    this.props.container.style.top = this.state.top;

    this.state.visible ? this.show() : this.hide();
  }

  public render() {
    return <div>
            { this.state.port ? <MediaObject imageSrc={ this.state.port.flag }
                                             header={ this.state.port.name }
                                             contentLines={ [this.state.port.nation] } /> : '' }

            <p className="occupied-by" style={{ display: this.state.occupied ? 'block' : 'none' }}>
               { (window as any).t("cell-tip.occupied-by") }
            </p>

            { this.state.ship ? <MediaObject imageSrc={ this.state.ship.flag }
                                             header={ this.state.ship.name }
                                             contentLines={[this.state.ship.fleet,
                                                            this.state.ship.HP]} /> : '' }
           </div>;
  }

  private isVisible() {
    return !this.props.container.classList.contains("hidden");
  }

  private hide() {
    if (!this.isVisible()) { return; }

    this.props.container.classList.add("transparent");
    this.props.container.classList.add("hidden");
  }

  private show() {
    this.props.container.classList.remove("hidden");
    this.props.container.classList.remove("transparent");
  }
}

interface Props {
  container: HTMLElement;
}

interface State {
  visible: boolean;
  cell: Coordinates;

  occupied: boolean;

  ship?: {
    name: string,
    fleet: string,
    flag: string,
    HP: string
  };

  port?: {
    name: string,
    nation: string;
    flag: string;
  }

  left: string;
  top: string;
}

export { CellTip };
