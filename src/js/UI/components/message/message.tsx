import * as React from "react";
import './message.css';

class Message extends React.Component<Props, State>  {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.props.container.addEventListener("transitionend", event => {
      (event.target as HTMLElement).classList.remove("flash");
      (event.target as HTMLElement).classList.add("hidden");
    });
  }

  public send(header: string, text: string, flash = false) {
    this.setState({header: header, body: text});

    this.props.container.classList.remove("hidden");

    if (flash) { this.props.container.classList.add("flash"); }
  }

  public render() {
    return <div>
            <div id="message-header" className="message-header">
              <p id="message-header-text">{ this.state.header }</p>
              <button id="message-close"
                      onClick={ this.dismiss.bind(this) }
                      className="delete"
                      aria-label="delete"></button>
            </div>
            <div id="message-text" className="message-body">
              <p id="message-body-text">{ this.state.body }</p>
              <div className="message-buttons">
                <button onClick={ this.dismiss.bind(this) } className="button is-warning is-light">
                  <i className="fa fa-check"></i>
                </button>
              </div>
            </div>
           </div>;
  }

  private dismiss() {
    this.props.container.classList.remove("flash");
    this.props.container.classList.add("hidden");
  }
}

interface Props {
  container: HTMLElement
}

interface State {
  header?: string;
  body?: string;
}

export { Message };
