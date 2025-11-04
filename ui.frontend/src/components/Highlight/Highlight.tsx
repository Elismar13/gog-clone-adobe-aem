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
  
  return ( 
    <div className="container">
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