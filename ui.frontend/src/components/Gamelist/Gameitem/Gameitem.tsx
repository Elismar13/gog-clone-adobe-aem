import React, { FunctionComponent } from "react";
import Game from "../../../interfaces/game";

interface GameitemProps {
  imagePath: string,
  game: Game
  discountInfo: {
    percentage: string,
    old: string,
    current: string
  }
}

const GameitemVertical: FunctionComponent<GameitemProps> = ({ imagePath, game, discountInfo }) => {
  return (
    <>
      <img
        className="card-img-top"
        src={imagePath}
        alt={game.title}
      />

      <div className="card-body p-2 d-flex flex-column justify-content-between">

        <h5 className="card-title text-white fs-5 text-truncate mb-2" title={game.title}>
          {game.title}
        </h5>

        <div className="d-flex justify-content-end align-items-end p-1 mt-auto">

          {game.discountValue > 0 && (
            <span className="badge gog-discount-bg rounded me-2 text-white fw-bold fs-6">
              {discountInfo.percentage}
            </span>
          )}

          <div className="d-flex flex-column text-end">
            {game.discountValue > 0 && (
              <span className="text-light text-decoration-line-through opacity-75">
                {discountInfo.old}
              </span>
            )}
            <span className="gog-card-price fs-6">
              <strong>{discountInfo.current}</strong>
            </span>
          </div>

        </div>
      </div>
    </>
  );
}

export default GameitemVertical;