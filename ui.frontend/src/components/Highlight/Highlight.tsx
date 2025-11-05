import React, { FunctionComponent } from "react";
import resolveImage from '../../util/resolveImage';

interface HighlightProps {
  title: string,
  externalLink: string,
  highlightPath: string,
}
 
const Highlight: FunctionComponent<HighlightProps> = ({
  title,
  externalLink,
  highlightPath
}) => {

  if(!title || !highlightPath) {
    return <div className="text-center text-white p-5 bg-dark">Preencha a Dialog do componente...</div>;
  }
  
  return ( 
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-white text-start fs-4 fw-bold mb-0">{title}</p>
      </div>

      <hr />
      <a 
        className="w-100"
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        >
          <img 
            className="w-100 d-block d-sm-block"
            src={resolveImage(highlightPath)}
            alt={title}
          />
        </a>
    </div>
  );
}
 
export default Highlight;