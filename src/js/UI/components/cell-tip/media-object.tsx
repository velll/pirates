import * as React from "react";

interface Props {
  imageSrc: string;
  header: string;
  contentLines: string[];
}

const MediaObject: React.SFC<Props> = (props: Props) =>  {
  return <article className="media port-info">
          <div className="media-left">
              <figure className="image is-64x64 port-icon flag">
                  <img src={ props.imageSrc } alt="Image"/>
              </figure>
          </div>
          <div className="media-content">
              <p><strong>{ props.header }</strong></p>
              { props.contentLines.map( (line, index) => (
                    <p key={ index }><small >{ line }</small></p>
              ))}
          </div>
        </article>;
};

export { MediaObject };
