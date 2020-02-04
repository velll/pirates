import * as React from "react";

interface Props {
  game_id: string;
  fleet: string;
  created_at: string;
  join_as: string;
}

const GameRow: React.SFC<Props> = (props: Props) =>  {
 return <tr>
          <td> { props.game_id} </td>
          <td> { props.fleet } </td>
          <td> { props.created_at }</td>
          <td><a className="button is-small is-light is-warning" href="/game.html">Join as { props.join_as } </a></td>
        </tr>;
};

export { GameRow };
