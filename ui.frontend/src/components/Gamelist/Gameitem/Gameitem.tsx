import React, { FunctionComponent } from "react";
import Game from "../../../interfaces/game";
import calculateDiscount from "../../../util/calculateDiscount";
import { AEM_HOST, GAME_DETAIL_PAGE_PATH } from "../../../constants/constants";
import { useHistory } from "react-router-dom";

import './gameitem.css';

interface GameitemProps {
  game: Game
}

const Gameitem: FunctionComponent<GameitemProps> = ({ game }) => {
  const history = useHistory();
  const handleRedirect = (gameTitle: string) => {
    history.push(`${GAME_DETAIL_PAGE_PATH}?gameTitle=${encodeURIComponent(gameTitle)}`);
  }

  const discountInfo = calculateDiscount(game.price, game.discountValue);
  const imagePath = game.imageList && `${AEM_HOST}${game.imageList[0]._path}`;

  return (
    <article className="col gog-card-hover" key={game._id}>
      <button 
        className="btn btn-link p-0 w-100 h-100 text-decoration-none"
        onClick={() => handleRedirect(game.title)}
        aria-label={`Ver detalhes de ${game.title} por ${discountInfo.current}`}
      >
        <div className="card h-100 bg-dark border-secondary rounded-3 overflow-hidden">
          <figure>
            <img
              className="card-img-top"
              src={imagePath}
              alt={`Capa do jogo ${game.title}`}
              loading="lazy"
              width="300"
              height="400"
            />
          </figure>

          <div className="card-body p-2 d-flex flex-column justify-content-between">

            <h3 className="card-title text-white fs-5 text-truncate mb-2" title={game.title}>
              {game.title}
            </h3>

            <div className="d-flex justify-content-end align-items-end p-1 mt-auto">

              {game.discountValue > 0 && (
                <span className="badge gog-discount-bg rounded me-2 text-white fw-bold fs-6" role="status" aria-label={`Desconto de ${discountInfo.percentage}`}>
                  {discountInfo.percentage}
                </span>
              )}

              <div className="d-flex flex-column text-end">
                {game.discountValue > 0 && (
                  <span className="text-light text-decoration-line-through opacity-75" aria-label="Preço original">
                    {discountInfo.old}
                  </span>
                )}
                <span className="gog-card-price fs-6" aria-label="Preço atual">
                  <strong>{discountInfo.current}</strong>
                </span>
              </div>

            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

export default Gameitem;