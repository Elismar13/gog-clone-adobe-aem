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
    <section className="container" aria-label={`Destaques: ${title}`}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-white text-start fs-4 fw-bold mb-0">{title}</h2>
      </header>

      <hr className="border-secondary" />
      
      <a 
        className="w-100 d-block text-decoration-none"
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver mais sobre ${title} - abre em nova aba`}
        >
          <figure>
            <img 
              className="w-100 d-block d-sm-block"
              src={resolveImage(highlightPath)}
              alt={title}
              loading="lazy"
            />
            <figcaption className="visually-hidden">{title}</figcaption>
          </figure>
        </a>
    </section>
  );
}
 
export default Highlight;