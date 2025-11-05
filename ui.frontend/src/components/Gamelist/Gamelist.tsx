import React, { FunctionComponent, useEffect, useState } from "react";

import api from "../../axios";
import Game from "../../interfaces/game";
import mockedGames from '../../api/mocked';

import Gameitem from "./Gameitem/Gameitem";


interface GamelistProps {
  title: string,
  genre: string,
  orientation: "horizontal" | "vertical"
};


const Gamelist: FunctionComponent<GamelistProps> = (props: GamelistProps) => {

  const [games, setGames] = useState<Game[]>([]);

  const { genre, title, orientation } = props;
  const gameGenre = genre != null ? genre.split('/').at(-1) : 'action';

  const handleLoadGames = async () => {
    try {
      const endpoint = `/graphql/execute.json/gogstore/getGamesByGenre;gameGenre=${gameGenre}`;

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
  })

  return (
    <div className="container text-white my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-white text-start fs-4 fw-bold mb-0">{title}</p>
        <span className="text-end">Veja mais</span>
      </div>

      <hr />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {games.map((game, index) => (
          <Gameitem
            key={index}
            game={game}
          />
        ))}
      </div>
    </div>
  );
}

export default Gamelist;