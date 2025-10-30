import React, { FunctionComponent, useEffect, useState } from "react";

import api from "../../axios";
import calculateDiscount from "../../util/calculateDiscount";
import Game from "../../interfaces/game";
import mockedGames from '../../api/mocked';

import './gamelist.css';

interface GamelistProps {
  title: string,
  category: string,
}

const Gamelist: FunctionComponent<GamelistProps> = ({ category, title }) => {

  const [games, setGames] = useState<Game[]>([]);

  const handleLoadGames = async () => {
    try {
      const endpoint = `/graphql/execute.json/gogstore/getGamesByGenre;gameGenre=${category}`;

      const response = await api.get(endpoint);

      const loadedGames = response.data?.data?.jogoList?.items || [];
      setGames(loadedGames);

    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      console.warn("Usando jogos mockados.");
      setGames(mockedGames);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, [])


// Assumindo que este código está dentro de um componente React funcional

return (
    <div className="container text-white my-5">
      {/* Título da Seção */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-white text-start fs-4 fw-bold mb-0">{title}</p>
        <span className="text-end">Veja mais</span>
      </div>

      <hr />

      {/* Listagem de Cards (Responsivo) */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {games.map((game, index) => {
          const discountInfo = calculateDiscount(game.price, game.discountValue);
          const imagePath = game.imageList && game.imageList.length > 0
            ? `http://localhost:4502${game.imageList[0]._path}`
            : 'https://via.placeholder.com/300x400/1a1a1a/FFF?text=Sem+Imagem';

          return (
            <div className="col gog-card-hover" key={index}>
              <div className="card h-100 bg-dark border-secondary rounded-3 overflow-hidden">
                
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Gamelist;