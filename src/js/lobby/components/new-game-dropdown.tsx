import * as React from "react";
import { t } from "../../data/i18n";

interface Props {
  starter: (fleet: string) => void;
}

const NewGameDropDown: React.SFC<Props> = (props: Props) =>  {
  const handles = {
    spaniards: () => props.starter('spaniards'),
    pirates : () => props.starter('pirates')
  };

  return  <div className="dropdown is-hoverable">
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                <span> { t("lobby.new-game") } </span>
                <span className="icon is-small">
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu4" role="menu">
              <div className="dropdown-content">
                <div className="dropdown-item">
                  { t('lobby.choose-side') }
                </div>
                <a href="#" onClick={ handles.spaniards } className="dropdown-item">
                  { t('fleets.spaniards') }
                </a>
                <a href="#" onClick={ handles.pirates } className="dropdown-item">
                  { t('fleets.pirates') }
                </a>
              </div>
            </div>
          </div>;
};

export { NewGameDropDown };
