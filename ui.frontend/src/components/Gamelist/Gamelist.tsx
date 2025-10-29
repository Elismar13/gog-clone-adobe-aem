import React, { FunctionComponent, useEffect, useState } from "react";

import api from "../../axios";
import calculateDiscount from "../../util/calculateDiscount";
import Game from "../../interfaces/game";
import mockedGames from '../../api/mocked';


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


  return (
    <div className="container text-white mt-4">
      <div className="d-flex justify-content-between p-2">
        <p className="text-white text-start fs-4">{title}</p>
        <span className="text-end">Veja mais</span>
      </div>

      <hr />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 ">
        {games.map((game, index) => {
          const discountInfo = calculateDiscount(game.price, game.discountValue);

          const imagePath = game.imageList[0]._path;

          if (!imagePath) return null;
          
          return (
            <div className="col">
              <div className="card border-secondary" key={index}>
                <img
                  className="card-img-top"
                  src={imagePath}
                  alt="Card image cap"
                />
                <div className="card-body bg-dark text-white">
                  <h5 className="card-title fs-5">{game.title}</h5>
                  <div className="d-flex justify-content-end p-1">
                      <p className="badge discount-percentage h-100 rounded me-3 text-dark fs-5">{discountInfo.percentage}</p>
                    <div className="d-flex flex-column text-end">
                      <span className="text-decoration-line-through"><small>{discountInfo.old}</small></span>
                      <span className=""><strong>{discountInfo.current}</strong></span>
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