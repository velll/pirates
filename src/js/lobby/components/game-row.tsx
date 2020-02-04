import * as React from "react";
import { t } from "../../data/i18n";

interface Props {
  game_id: string;
  fleet: string;
  created_at: string;
  join_as: string;
  joiner: () => void;
}

const GameRow: React.SFC<Props> = (props: Props) =>  {
 return <tr>
          <td> { props.game_id} </td>
          <td> { props.fleet } </td>
          <td> { props.created_at }</td>
          <td>
            <a className="button is-small is-light is-warning"
               onClick={ props.joiner } >
               { t("lobby.join-as", {fleet: props.join_as}) }
            </a>
          </td>
        </tr>;
};

export { GameRow };
